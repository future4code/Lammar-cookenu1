import { CustomError, RecipeNotFound } from "../error/customError";
import { recipe } from "../model/recipe";
import { BaseDatabase } from "./BaseDatabase";

export class RecipeDatabase extends BaseDatabase {
  public insertRecipe = async (recipe: recipe) => {
    try {
      await RecipeDatabase.connection.insert(recipe).into("Cookenu_recipes");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public findRecipe = async (title: string) => {
    try {
      const result = await RecipeDatabase.connection("Cookenu_recipes")
        .select()
        .where({ title });

      return result[0];
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getRecipesById = async (id: string): Promise<recipe> => {
    try {
      const Recipe = await RecipeDatabase.connection("Cookenu_recipes")
        .select("id", "title", "description")
        .where({ id });
      if (!Recipe) {
        throw new RecipeNotFound();
      }
      return Recipe[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}
