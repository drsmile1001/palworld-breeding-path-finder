import { findPaths } from "./Finders.ts";
import { getAllPals, getPalId, getPalName } from "./PalRepo.ts";

Deno.test("find path", async () => {
  const start = "冰棘兽";
  const end = "百合女王";
  console.log(`find path from ${start} to ${end}`);
  let result = "";
  for await (
    const path of findPaths(getPalId(start), getPalId(end), 2)
  ) {
    const line = path.map((step) =>
      `${getPalName(step.result)}(${getPalName(step.add)})`
    ).join(" > ");
    result += line + "\n";
  }
  console.log(result);
  Deno.writeTextFileSync(
    "result.txt",
    result,
  );
});

Deno.test("generate pal power ranking", () => {
  const pals = getAllPals();
  const indexByPower = pals.slice().sort((a, b) => a.power - b.power).map((
    pal,
    index,
  ) => ({
    pal,
    index,
  })).reduce((acc, { pal, index }) => {
    acc.set(pal.id, index);
    return acc;
  }, new Map<string, number>());

  const rankTable = pals.slice().sort((a, b) =>
    Number(b.id.match(/\d+/)![0]) - Number(a.id.match(/\d+/)![0])
  ).map((pal, index) => {
    const powerIndex = indexByPower.get(pal.id)!;
    return {
      id: pal.id,
      name: pal.name,
      power: pal.power,
      powerIndex,
      distance: index - powerIndex,
    };
  });
  console.table(rankTable);
  const outputText = rankTable.reduce(
    (acc, { id, name, power, powerIndex, distance }) => {
      acc += `${id}\t${name}\t${power}\t${powerIndex}\t${distance}\n`;
      return acc;
    },
    "ID\tName\tPower\tPowerIndex\tDistance\n",
  );
  Deno.writeTextFileSync(
    "power-ranking.txt",
    outputText,
  );
});
