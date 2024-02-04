import { IndexSortedCollection } from "./IndexSortedCollection.ts";

type BreedingPowerEntry = {
  id: string;
  name: string;
  power: number;
  indexOrder: number;
};

const breedingPowerText = await Deno.readTextFile("BreedingPower.txt");
const breedingPowerEntries: BreedingPowerEntry[] = breedingPowerText.split("\n")
  .map(
    (line) => {
      const [id, _en, name, power, indexOrder] = line.split("\t").map((c) =>
        c.trim()
      );
      return ({
        id: id,
        name,
        power: Number(power),
        indexOrder: Number(indexOrder),
      });
    },
  );

export function getAllPals() {
  return [...idIndexedPals.values()];
}

const idIndexedPals = breedingPowerEntries.reduce((acc, entry) => {
  acc.set(entry.id, entry);
  return acc;
}, new Map<string, BreedingPowerEntry>());

export function getPalName(id: string): string {
  return idIndexedPals.get(id)?.name ?? "Unknown";
}

const nameIndexedPals = breedingPowerEntries.reduce((acc, entry) => {
  acc.set(entry.name, entry);
  return acc;
}, new Map<string, BreedingPowerEntry>());

export function getPalId(name: string): string {
  return nameIndexedPals.get(name)?.id ?? "Unknown";
}

export function getPalPower(id: string): number {
  return idIndexedPals.get(id)?.power ?? 0;
}

const specialBreedingsText = await Deno.readTextFile("SpecialBreedings.txt");
const { specialBreedingMap, specialBreedingPals } = specialBreedingsText.split(
  "\n",
)
  .reduce((acc, line) => {
    const { specialBreedingMap, specialBreedingPals } = acc;
    const [_1, pal1Name, _2, pal2Name, _3, resultPalName] = line.split("\t")
      .map((c) => c.trim());
    const pal1Id = getPalId(pal1Name);
    const pal2Id = getPalId(pal2Name);
    const resultId = getPalId(resultPalName);
    specialBreedingPals.add(resultId);
    const pal1Map = specialBreedingMap.get(pal1Id) ?? new Map<string, string>();
    pal1Map.set(pal2Id, resultId);
    specialBreedingMap.set(pal1Id, pal1Map);
    const pal2Map = specialBreedingMap.get(pal2Id) ?? new Map<string, string>();
    pal2Map.set(pal1Id, resultId);
    specialBreedingMap.set(pal2Id, pal2Map);
    return acc;
  }, {
    specialBreedingMap: new Map<string, Map<string, string>>(),
    specialBreedingPals: new Set<string>(),
  });

const breedingPowerIndexedPals = new IndexSortedCollection<
  BreedingPowerEntry
>(
  breedingPowerEntries.filter((entry) => !specialBreedingPals.has(entry.id)),
  (entry) => entry.power,
);

export function breed(pal1Id: string, pal2Id: string): string {
  const specialResult = specialBreedingMap.get(pal1Id)?.get(pal2Id);
  if (specialResult) {
    return specialResult;
  }
  const pal1 = idIndexedPals.get(pal1Id);
  const pal2 = idIndexedPals.get(pal2Id);
  if (!pal1 || !pal2) {
    throw new Error("Invalid pal id");
  }
  const power = Math.floor((pal1.power + pal2.power + 1) / 2);
  const found = breedingPowerIndexedPals.findClosestItems(power);
  if (found.exactMatch) {
    const exactMatchId = found.matchedItems.slice().sort((a, b) =>
      a.indexOrder - b.indexOrder
    )[0].id;
    return exactMatchId;
  }
  const lower = found.leftItems[0];
  const upper = found.rightItems[0];
  if (specialBreedingPals.has(lower.id)) {
    return upper.id;
  }
  if (specialBreedingPals.has(upper.id)) {
    return lower.id;
  }
  const absDiffLower = Math.abs(power - lower.power);
  const absDiffUpper = Math.abs(power - upper.power);
  if (absDiffLower < absDiffUpper) {
    return lower.id;
  }
  if (absDiffLower > absDiffUpper) {
    return upper.id;
  }
  return lower.indexOrder < upper.indexOrder ? lower.id : upper.id;
}

const allBreedingMap = [...idIndexedPals.keys()].reduce((acc, aId) => {
  const map = [...idIndexedPals.keys()].reduce((acc, bId) => {
    const resultId = breed(aId, bId);
    acc.set(bId, resultId);
    return acc;
  }, new Map<string, string>());
  acc.set(aId, map);
  return acc;
}, new Map<string, Map<string, string>>());

export function getBreedingResult(
  pal1Id: string,
  pal2Id: string,
): string | null {
  const result = allBreedingMap.get(pal1Id)?.get(pal2Id) ?? null;
  return result;
}

export function getRecipes(palId: string): Map<string, string> {
  if (!allBreedingMap.has(palId)) throw new Error("Invalid pal id");
  return allBreedingMap.get(palId)!;
}
