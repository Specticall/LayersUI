import fs from "fs/promises";

export async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileTo({
  path,
  file,
  name,
}: {
  path: string;
  file: string;
  name: string;
}) {
  const fileAlreadyExists = await fileExists(path);
  if (fileAlreadyExists) {
    throw new Error(`File with the name ${name} already exists`);
  }

  await fs.writeFile(`${path}/${name}`, file);
  return "Successfuly written file";
}
