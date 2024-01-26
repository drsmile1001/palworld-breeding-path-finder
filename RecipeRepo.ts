export class RecipeRepo {
  data: Map<string, Map<string, string>> = new Map();
  private async loadData() {
    const text = await Deno.readTextFile("./data.txt");
    text.split("\n")
      .forEach((line) => {
        const [_a, aName, _b, bName, _c, cName] = line.split("\t").map((x) =>
          x.trim()
        );
        if (!this.data.has(aName)) {
          this.data.set(aName, new Map());
        }
        this.data.get(aName)!.set(bName, cName);
        if (!this.data.has(bName)) {
          this.data.set(bName, new Map());
        }
        this.data.get(bName)!.set(aName, cName);
      });
  }

  async getResult(a: string, b: string): Promise<string | undefined> {
    if (!this.data.has(a)) {
      await this.loadData();
    }
    return this.data.get(a)!.get(b);
  }

  async getRecipes(a: string): Promise<Map<string, string>> {
    if (!this.data.has(a)) {
      await this.loadData();
    }
    return this.data.get(a)!;
  }
}

export const recipeRepo = new RecipeRepo();
