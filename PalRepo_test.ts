import { assertEquals } from "https://deno.land/std@0.213.0/assert/assert_equals.ts";
import { getPalName } from "./PalRepo.ts";

Deno.test("PalRepo_getPalName", () => {
  assertEquals(getPalName("1"), "棉悠悠");
  assertEquals(getPalName("104"), "百合女王");
});
