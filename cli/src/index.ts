#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";

async function main() {
  try {
    const program = new Command()
      .name("layers-ui")
      .description("Adds pre-made components to projects")
      .version("1.0.0");

    program.addCommand(add);

    program.parse(process.argv);
  } catch (err) {
    console.log((err as Error).message);
  }
}

function test() {
  // const cwd = path.resolve("./src/components");
  // console.log(cwd);
}

if (process.argv[2] === "test") {
  test();
} else {
  main();
}
