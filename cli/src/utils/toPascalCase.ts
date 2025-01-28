export function toPascalCase(input: string, delimiter: string, join?: string) {
  const capitalizedWords = input
    .split(delimiter)
    .map((word) => `${word.split("")[0].toUpperCase()}${word.slice(1)}`);
  return capitalizedWords.join(join || "");
}
