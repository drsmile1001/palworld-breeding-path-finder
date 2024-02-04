import { assertEquals } from "https://deno.land/std@0.213.0/assert/assert_equals.ts";
import { breed, getPalId, getPalName } from "./PalRepo.ts";

Deno.test("PalRepo_getPalName", () => {
  assertEquals(getPalName("1"), "棉悠悠");
  assertEquals(getPalName("104"), "百合女王");
});

Deno.test("燧火鸟 id is 74", () => {
  assertEquals(getPalId("燧火鸟"), "74");
});

Deno.test("燧火鸟+幻悦蝶=叶胖达", () => {
  const aId = getPalId("燧火鸟");
  const bId = getPalId("幻悦蝶");
  const result = breed(aId, bId);
  assertEquals(getPalName(result), "叶胖达");
});

Deno.test("阿努比斯+寐魔=趴趴鲶", () => {
  const aId = getPalId("阿努比斯");
  const bId = getPalId("寐魔");
  const result = breed(aId, bId);
  assertEquals(getPalName(result), "趴趴鲶");
});
