import { recipeRepo } from "./RecipeRepo.ts";
const source = "寐魔";
const target = "阿努比斯";
const allowedAdds = new Set([
  "棉悠悠",
  "捣蛋猫",
  "皮皮鸡",
  "翠叶鼠",
  "火绒狐",
  "冲浪鸭",
  "伏特喵",
  "新叶猿",
  "企丸丸",
  "企丸王",
  "电棘鼠",
  "冰刺鼠",
  "叶泥泥",
  "玉藻狐",
  "啼卡尔",
  "壶小象",
  "瞅什魔",
  "米露菲",
  "寐魔",
  "草莽猪",
  "露娜蒂",
  "遁地鼠",
  "喵丝特",
  "冰丝特",
  "鲁米儿",
  "猎狼",
  "炸蛋鸟",
  "波娜兔",
  "波霸牛",
  "荆棘魔仙",
  "叶胖达",
  "雷胖达",
  "棉花糖",
  "灌木羊",
  "美露帕",
  "紫霞鹿",
  "疾风隼",
  "姬小兔",
]);

type Step = {
  add: string;
  result: string;
};

type Path = Step[];

async function* findPath(maxDeep = 5, allowedAdds?: Set<string>) {
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

const finder = findPath(3, allowedAdds);

for await (const path of finder) {
  console.log(path);
}