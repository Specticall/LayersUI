import { Command } from "commander";
import { getConfig } from "../utils/getConfig.js";
import { prisma } from "../config/config.js";
import { z } from "zod";
import prompts from "prompts";
import { installComponent } from "../utils/installComponent.js";
import { getComponentsFromDB } from "../utils/getComponentsFromDB.js";
import { logger } from "../utils/logger.js";
import chalk from "chalk";
import ora from "ora";
import { checkInstalledPackages } from "../utils/checkInstalledPackages.js";
import { installPackage } from "../utils/installPackage.js";

const addArgumentsSchema = z.object({
  components: z.array(z.string()),
});

export const add = new Command()
  .name("add")
  .description("adds component to your project")
  .argument("[components...]", "components to add")
  .action(async (components) => {
    try {
      const config = await getConfig();

      const options = addArgumentsSchema.parse({ components });

      const availableComponentNames = (
        await prisma.component.findMany({
          select: {
            name: true,
          },
        })
      ).map((component) => component.name);

      // Check for invalid component names
      const validComponentNames: string[] = [];
      const invalidComponentNames: string[] = [];

      options.components.forEach((name) => {
        if (availableComponentNames.includes(name)) {
          validComponentNames.push(name);
        } else {
          invalidComponentNames.push(name);
        }
      });

      // Display invalid component names if they exist
      if (invalidComponentNames.length > 0) {
        console.log(
          chalk.yellow("Ignoring Invalid Component Names:"),
          invalidComponentNames.join(", ")
        );
      }

      // If user doesnt pass in a component as argument, display a prompt style menu
      let selectedComponentNames = validComponentNames;
      if (options.components.length <= 0) {
        const { components } = await prompts({
          instructions: false,
          type: "multiselect",
          hint: "Press [space] to select, [a] to select all, [enter] to submit",
          name: "components",
          message: "Select components",
          choices: availableComponentNames.map((component) => {
            return { title: component, value: component };
          }),
        });
        selectedComponentNames = components;
      }

      if (selectedComponentNames.length <= 0) {
        logger.info("No valid components selected, exiting.");
        return;
      }

      // Get the list of installed packages.
      const installedPackages = await checkInstalledPackages();

      // Install components and their dependencies using BFS travesal
      const componentsData = await getComponentsFromDB(selectedComponentNames);
      const installed = new Set<string>();
      let queue = componentsData;

      const packagesToBeInstalled: string[] = [];
      while (queue.length > 0) {
        // Install components on the current level
        const spinner = ora("Installing components...").start();
        await Promise.all(
          queue.map((component) => {
            // Mark the installed components as `installed` (aka visited)
            installed.add(component.name);
            return installComponent(component, config);
          })
        );
        spinner.stop();

        // Traverse to neighbouring components
        const toBeInstalled: string[] = [];
        for (const { dependencies } of queue) {
          for (const dependencyName of dependencies) {
            // Append package names that needs to be installed (not included inside the package.json file)
            if (dependencyName.includes("package/")) {
              const packageName = dependencyName.replace("package/", "");
              if (
                !installedPackages.includes(packageName.replace("dev/", "")) &&
                !packagesToBeInstalled.includes(packageName)
              ) {
                packagesToBeInstalled.push(packageName);
              }
              continue;
            }

            // Mark the dependency as visited
            const name = dependencyName.replace("component/", "");
            if (!installed.has(name)) {
              toBeInstalled.push(name);
              installed.add(name);
            }
          }
        }
        queue = [];

        if (toBeInstalled.length > 0) {
          const spinner = ora("Fetching components...").start();
          queue = await getComponentsFromDB(toBeInstalled);
          spinner.stop();
        }
      }

      // Install the necessary packages
      if (packagesToBeInstalled.length > 0) {
        const spinner = ora("Installing dependencies...").start();
        await installPackage(packagesToBeInstalled);
        spinner.succeed("Completed dependency installation");
      }
    } catch (err) {
      console.log(err);
    }
  });
