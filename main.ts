import { findPaths } from "./Finders.ts";
import { getPalPower } from "./PalRepo.ts";
import { getAllPals, getPalId, getPalName } from "./PalRepo.ts";

Deno.test("find path", () => {
  const start = "波鲁杰克斯";
  const end = "魔渊龙";
  type PathStep = {
    add: string;
    result: string;
    power: number;
  };
  const paths: PathStep[][] = [];
  for (
    const path of findPaths(getPalId(start), getPalId(end), 2)
  ) {
    paths.push(
      path.slice(1).map((step) => (<PathStep> {
        add: getPalName(step.add),
        result: getPalName(step.result),
        power: getPalPower(step.result),
      })),
    );
  }
  paths.sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    for (let step = 0; step < a.length; step++) {
      const aStepPower = a[step]?.power ?? -1;
      const bStepPower = b[step]?.power ?? -1;
      if (aStepPower !== bStepPower) return aStepPower - bStepPower;
    }
    return a[a.length - 1].result.localeCompare(b[b.length - 1].result);
  });

  const showTable = paths.map((path) => {
    const obj: Record<string, string> = {
      source: start,
    };
    path.forEach((step, i) => {
      obj[`step ${i + 1} add`] = step.add;
      obj[`step ${i + 1} result`] = `${step.result} (${step.power})`;
    });
    return obj;
  });
  console.table(showTable);
  const header = `source\t${
    [1, 2].map((i) => `step ${i} add\tstep ${i} result`).join("\t")
  }\n`;
  const text = paths.reduce((acc, path) => {
    acc += path.reduce((acc, step) => {
      acc += `\t${step.add}\t${step.result} (${step.power})`;
      return acc;
    }, start) + "\n";
    return acc;
  }, header);
  Deno.writeTextFileSync(
    `output/path ${start} to ${end}.tsv`,
    text,
  );
});

Deno.test("generate pal power ranking", () => {
  const pals = getAllPals();
  const powerOrderMap = pals.slice().sort((a, b) => b.power - a.power).map((
    pal,
    order,
  ) => ({
    pal,
    order,
  })).reduce((acc, { pal, order }) => {
    acc.set(pal.id, order);
    return acc;
  }, new Map<string, number>());

  const rankTable = pals.slice().sort((a, b) =>
    Number(a.id.match(/\d+/)![0]) - Number(b.id.match(/\d+/)![0])
  ).map((pal, idOrder) => {
    const powerOrder = powerOrderMap.get(pal.id)!;
    return {
      idOrder,
      id: pal.id,
      name: pal.name,
      power: pal.power,
      powerOrder,
      distance: powerOrder - idOrder,
    };
  });
  console.table(rankTable);
  const outputText = rankTable.reduce(
    (acc, { idOrder, id, name, power, powerOrder, distance }) => {
      acc +=
        `${idOrder}\t${id}\t${name}\t${power}\t${powerOrder}\t${distance}\n`;
      return acc;
    },
    "ID Order\tID\tName\tPower\tPower Order\tOrder Distance\n",
  );
  Deno.writeTextFileSync(
    "output/power-ranking.tsv",
    outputText,
  );
});
