import { Command } from "commander";
import { getConfig } from "../utils/getConfig.js";
import { prisma } from "../config/config.js";
import { z } from "zod";
import { writeFileTo } from "../utils/writeFile.js";
import path from "path";
import { toCamelCase } from "../utils/toCamelCase.js";

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
        console.log("Ignoring Invalid Component Names: ");
        invalidComponentNames.forEach((names, i) => {
          console.log(` [${i + 1}] ${names}`);
        });
      }

      // Fetch valid components
      const componentsData = await prisma.component.findMany({
        select: {
          content: true,
          name: true,
        },
        where: {
          name: {
            in: validComponentNames,
          },
        },
      });

      componentsData.forEach(async (component) => {
        const fileName = toCamelCase(component.name, "-") + ".tsx";
        await writeFileTo({
          path: path.resolve(process.cwd(), config.path.components),
          name: fileName,
          file: component.content,
        });
      });
      console.log(componentsData);
    } catch (err) {
      console.log(err);
    }
  });
