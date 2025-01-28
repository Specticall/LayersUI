import path from "path";
import { prisma } from "../config/config.js";
import fs from "fs/promises";

const cn = ["package/dev/tailwind-merge", "package/dev/clsx"];

const components = [
  {
    name: "button",
    fileName: "Button.tsx",
    dependencies: [
      ...cn,
      "package/dev/class-variance-authority",
      "component/loading-spinner",
    ],
  },
  {
    name: "dashboard-layout",
    fileName: "DashboardLayout.tsx",
    dependencies: ["component/table"],
  },
  {
    name: "dialog",
    fileName: "Dialog.tsx",
    dependencies: [...cn],
  },
  {
    name: "dropdown",
    fileName: "Dropdown.tsx",
    dependencies: [
      ...cn,
      "component/popover",
      "package/react-loading-skeleton",
    ],
  },
  {
    name: "input",
    fileName: "Input.tsx",
    dependencies: [...cn, "package/react-loading-skeleton"],
  },
  {
    name: "loading-spinner",
    fileName: "LoadingSpinner.tsx",
    dependencies: [...cn],
  },
  {
    name: "popover",
    fileName: "Popover.tsx",
    dependencies: [...cn],
  },
  {
    name: "table",
    fileName: "Table.tsx",
    dependencies: [...cn],
  },
  {
    name: "toast",
    fileName: "Toast.tsx",
    dependencies: [...cn],
  },
];

async function main() {
  // Retrieve component files
  const componentFiles = await Promise.allSettled(
    components.map(({ fileName }) =>
      fs.readFile(
        path.resolve(
          process.cwd(),
          "../components/src/components/ui/",
          fileName
        ),
        "utf-8"
      )
    )
  );

  const componentFileWithDetails = componentFiles.map((file, i) => {
    return {
      dependencies: components[i].dependencies,
      content: file.status === "fulfilled" ? file.value : "",
      name: components[i].name,
    };
  });

  await prisma.component.createMany({
    data: componentFileWithDetails,
  });

  console.log("SEED SUCCESSFUL");
}

main();
