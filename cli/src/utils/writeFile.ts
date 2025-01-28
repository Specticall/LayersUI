import fs from "fs/promises";

export async function fileExists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileTo({
  path,
  file,
  name,
  replace,
}: {
  path: string;
  file: string;
  name: string;
  replace?: boolean;
}) {
  const pathWithFileName = `${path}/${name}`;
  const fileAlreadyExists = await fileExists(pathWithFileName);
  if (fileAlreadyExists && !replace) {
    return false;
  }

  await fs.writeFile(pathWithFileName, file);
  return true;
}
