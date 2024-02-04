import { assertEquals } from "https://deno.land/std@0.213.0/assert/mod.ts";
import { IndexSortedCollection } from "./IndexSortedCollection.ts";

const collection = new IndexSortedCollection(
  [3, 1, 6, 1, 10, 6, 15],
  (item) => item,
);

Deno.test("find index smaller than all", () => {
  const result = collection.findClosestItems(0);
  assertEquals(result.exactMatch, false);
  if (!result.exactMatch) {
    assertEquals(result.leftItems, []);
    assertEquals(result.rightItems, [1, 1]);
  }
});

Deno.test("find index larger than all", () => {
  const result = collection.findClosestItems(16);
  assertEquals(result.exactMatch, false);
  if (!result.exactMatch) {
    assertEquals(result.leftItems, [15]);
    assertEquals(result.rightItems, []);
  }
});

Deno.test("find index between 2", () => {
  const result = collection.findClosestItems(5);
  assertEquals(result.exactMatch, false);
  if (!result.exactMatch) {
    assertEquals(result.leftItems, [3]);
    assertEquals(result.rightItems, [6, 6]);
  }
});

Deno.test("find index exact matched 1", () => {
  const result = collection.findClosestItems(3);
  assertEquals(result.exactMatch, true);
  if (result.exactMatch) {
    assertEquals(result.matchedItems, [3]);
  }
});

Deno.test("find index exact matched mutiple", () => {
  const result = collection.findClosestItems(6);
  assertEquals(result.exactMatch, true);
  if (result.exactMatch) {
    assertEquals(result.matchedItems, [6, 6]);
  }
});

Deno.test("find items", () => {
  assertEquals(collection.findItem(0), undefined);
  assertEquals(collection.findItem(16), undefined);
  assertEquals(collection.findItem(5), undefined);
  assertEquals(collection.findItem(3), [3]);
  assertEquals(collection.findItem(6), [6, 6]);
});
