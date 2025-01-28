import { prisma } from "../config/config.js";

export function getComponentsFromDB(componentNames: string[]) {
  return prisma.component.findMany({
    select: {
      content: true,
      name: true,
      dependencies: true,
    },
    where: {
      name: {
        in: componentNames,
      },
    },
  });
}
