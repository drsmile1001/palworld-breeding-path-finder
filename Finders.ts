import { getBreedingResult, getRecipes } from "./PalRepo.ts";

type Step = {
  add: string;
  result: string;
};

type Path = Step[];

export function* findPaths(
  sourceId: string,
  targetId: string,
  maxDeep = 5,
  allowedAdds?: Set<string>,
) {
  let paths: Path[] = [[{
    add: sourceId,
    result: sourceId,
  }]];
  let deep = 0;
  while (true) {
    deep++;
    if (deep > maxDeep) break;
    const newPaths: Path[] = [];
    for (const path of paths) {
      const lastStep = path[path.length - 1];
      const map = getRecipes(lastStep.result);
      for (const [add, result] of map) {
        if (add === targetId) continue;
        if (allowedAdds && !allowedAdds.has(add)) continue;
        if (result === targetId) {
          yield [...path, { add, result }];
          continue;
        }
        newPaths.push([...path, { add, result }]);
      }
    }
    if (newPaths.length === 0) break;
    paths = newPaths;
  }
}

export async function* findcombinationRecipes(seeds: string[]) {
  for (let a = 0; a < seeds.length; a++) {
    const elementA = seeds[a];
    for (let b = a + 1; b < seeds.length; b++) {
      const elementB = seeds[b];
      const result = getBreedingResult(elementA, elementB);
      if (!result) continue;
      yield [elementA, elementB, result!];
    }
  }
}
