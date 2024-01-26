import { recipeRepo } from "./RecipeRepo.ts";

type Step = {
  add: string;
  result: string;
};

type Path = Step[];

export async function* buildPathFinder(
  source: string,
  target: string,
  maxDeep = 5,
  allowedAdds?: Set<string>,
) {
  let paths: Path[] = [[{
    add: source,
    result: source,
  }]];
  let deep = 0;
  while (true) {
    deep++;
    if (deep > maxDeep) break;
    const newPaths: Path[] = [];
    for (const path of paths) {
      const lastStep = path[path.length - 1];
      const map = await recipeRepo.getRecipes(lastStep.result);
      for (const [add, result] of map) {
        if (allowedAdds && !allowedAdds.has(add)) continue;
        if (result === target) {
          yield [...path, { add, result }];
        }
        newPaths.push([...path, { add, result }]);
      }
    }
    if (newPaths.length === 0) break;
    paths = newPaths;
  }
}
