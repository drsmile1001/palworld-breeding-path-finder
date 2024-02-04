import { assertEquals } from "https://deno.land/std@0.213.0/assert/assert_equals.ts";
import { breed, getPalId, getPalName } from "./PalRepo.ts";

Deno.test("PalRepo_getPalName", () => {
  assertEquals(getPalName("1"), "棉悠悠");
  assertEquals(getPalName("104"), "百合女王");
});

Deno.test("燧火鸟 id is 74", () => {
  assertEquals(getPalId("燧火鸟"), "74");
});

Deno.test("燧火鸟_幻悦蝶_叶胖达", () => {
  const aId = getPalId("燧火鸟");
  const bId = getPalId("幻悦蝶");
  const result = breed(aId, bId);
  assertEquals(getPalName(result), "叶胖达");
});
