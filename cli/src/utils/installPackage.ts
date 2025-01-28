import { execa } from "execa";

export async function installPackage(packages: string[]) {
  try {
    const devDepedencies: string[] = [];
    const dependencies: string[] = [];

    packages.forEach((dep) => {
      if (dep.includes("dev/")) {
        devDepedencies.push(dep.replace("dev/", ""));
      } else {
        dependencies.push(dep);
      }
    });

    await execa("npm", ["install", "-D", ...devDepedencies], {
      cwd: process.cwd(),
    });

    await execa("npm", ["install", ...dependencies], {
      cwd: process.cwd(),
    });
    return true;
  } catch {
    return false;
  }
}
