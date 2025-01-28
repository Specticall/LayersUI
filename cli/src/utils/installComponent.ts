import { toPascalCase } from "./toPascalCase.js";
import ora from "ora";
import path from "path";
import { Component } from "@prisma/client";
import { writeFileTo } from "./writeFile.js";
import { resolveComponentImports } from "./resolveComponentImports.js";
import { ConfigSchema } from "./getConfig.js";

export async function installComponent(
  component: Omit<Component, "id">,
  config: ConfigSchema,
  opts?: { replace?: boolean }
) {
  const spinner = ora(`Writing ${component.name}...`).start();
  const fileName = toPascalCase(component.name, "-") + ".tsx";
  const successfulyWrittenFile = await writeFileTo({
    path: path.resolve(process.cwd(), "." + config.path.components),
    name: fileName,
    file: resolveComponentImports(component.content, config.path),
    replace: opts?.replace,
  });
  if (successfulyWrittenFile) {
    spinner.succeed(
      `Successfuly inserted ${toPascalCase(component.name, "-", " ")}.`
    );
  } else {
    spinner.stop();
  }

  // if (packageDependencies.length > 0) {
  //   try {
  //     await execa("npm", ["install", "-D", ...packageDependencies], {
  //       cwd: process.cwd(),
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     spinner.fail("Failed to install dependencies");
  //   }
  // }
}
