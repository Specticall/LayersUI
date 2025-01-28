import { ConfigSchema } from "./getConfig.js";

export function resolveComponentImports(
  file: string,
  paths: ConfigSchema["path"]
) {
  return file
    .replace("@/components/ui", `${paths.components.replace("/src", "@")}`)
    .replace("@/utils/lib", `${paths.utils.replace("/src", "@")}`);
}
