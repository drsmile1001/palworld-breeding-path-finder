export type FindClosedItemsResult<TItem> = {
  exactMatch: true;
  matchedItems: TItem[];
} | {
  exactMatch: false;
  leftItems: TItem[];
  rightItems: TItem[];
};

export class IndexSortedCollection<TItem> {
  private indexedCollections: Map<number, TItem[]>;
  private sortedIndexes: number[];

  constructor(collection: TItem[], indexSelector: (item: TItem) => number) {
    this.indexedCollections = collection.reduce((acc, item) => {
      const index = indexSelector(item);
      if (!acc.has(index)) {
        acc.set(index, []);
      }
      acc.get(index)!.push(item);
      return acc;
    }, new Map<number, TItem[]>());
    this.indexedCollections.clear;
    this.sortedIndexes = [...this.indexedCollections.keys()].sort((a, b) =>
      a - b
    );
  }

  private findClosestIndexPointer(index: number): {
    exactMatch: boolean;
    exact?: number;
    left?: number;
    right?: number;
  } {
    if (this.sortedIndexes.length === 0) {
      return {
        exactMatch: false,
      };
    }

    if (index < this.sortedIndexes[0]) {
      return {
        exactMatch: false,
        right: 0,
      };
    }

    if (index > this.sortedIndexes[this.sortedIndexes.length - 1]) {
      return {
        exactMatch: false,
        left: this.sortedIndexes.length - 1,
      };
    }

    let leftPointer = 0;
    let rightPointer = this.sortedIndexes.length - 1;
    while (true) {
      const midPointer = Math.floor((leftPointer + rightPointer) / 2);
      const midIndex = this.sortedIndexes[midPointer];

      if (midIndex === index) {
        return {
          exactMatch: true,
          exact: midPointer,
        };
      }
      if (leftPointer === rightPointer) {
        return {
          exactMatch: false,
          left: leftPointer - 1,
          right: rightPointer,
        };
      }
      if (midIndex > index) {
        rightPointer = midPointer;
      } else {
        leftPointer = midPointer + 1;
      }
    }
  }

  findClosestItems(
    index: number,
  ): FindClosedItemsResult<TItem> {
    const pointer = this.findClosestIndexPointer(index);
    if (pointer.exactMatch) {
      return {
        exactMatch: true,
        matchedItems: this.indexedCollections.get(
          this.sortedIndexes[pointer.exact!],
        )!,
      };
    }
    const leftItems = pointer.left !== undefined
      ? this.indexedCollections.get(this.sortedIndexes[pointer.left])!
      : [];
    const rightItems = pointer.right !== undefined
      ? this.indexedCollections.get(this.sortedIndexes[pointer.right])!
      : [];
    return {
      exactMatch: false,
      leftItems,
      rightItems,
    };
  }

  findItem(index: number): TItem[] | undefined {
    const closestItems = this.findClosestItems(index);
    if (closestItems.exactMatch) {
      return closestItems.matchedItems;
    } else {
      return undefined;
    }
  }

  *previousItem(index: number) {
    const closestPointer = this.findClosestIndexPointer(index);
    if (!closestPointer.exactMatch) return;
    let pointer = closestPointer.exact!;
    while (true) {
      pointer--;
      if (pointer < 0) return;
      const items = this.indexedCollections.get(this.sortedIndexes[pointer]);
      yield items!;
    }
  }

  *nextItem(index: number) {
    const closestPointer = this.findClosestIndexPointer(index);
    if (!closestPointer.exactMatch) return;
    let pointer = closestPointer.exact!;
    while (true) {
      pointer++;
      if (pointer >= this.sortedIndexes.length) return;
      const items = this.indexedCollections.get(this.sortedIndexes[pointer]);
      yield items!;
    }
  }
}
