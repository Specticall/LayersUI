import { z } from "zod";
import fs from "fs/promises";

const configSchema = z.object({
  path: z.object(
    {
      utils: z.string({ message: "utils path is missing" }),
      components: z.string({ message: "components path is missing" }),
    },
    { message: "`path` config is missing " }
  ),
});

export type ConfigSchema = z.infer<typeof configSchema>;

/**
 * Retrieves components.json file config from root directory
 */
export async function getConfig() {
  const cwd = process.cwd();
  const rawConfig = await fs.readFile(`${cwd}/components.json`, "utf-8");
  const config = JSON.parse(rawConfig);

  const validatedConfig = configSchema.safeParse(config);
  if (!validatedConfig.success) {
    throw new Error("Invalid configuration file");
  }

  return validatedConfig.data;
}
