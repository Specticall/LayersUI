export function toCamelCase(input: string, delimiter: string) {
  const capitalizedWords = input
    .split(delimiter)
    .map((word) => `${word.split("")[0].toUpperCase()}${word.slice(1)}`);
  return capitalizedWords.join("");
}
