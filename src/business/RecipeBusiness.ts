import { RecipeDatabase } from "../data/RecipeDatabase";
import {
  CustomError,
  InvalidName,
  RecipeAlreadyExists,
  RecipeNotFound,
  ShortDescription,
} from "../error/customError";
import { recipe, RecipeInputDTO } from "../model/recipe";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";

const idGenerator = new IdGenerator();
const tokenGenerator = new TokenGenerator();
const hashManager = new HashManager();
const recipeDatabase = new RecipeDatabase();

export class RecipeBusiness {
  public createRecipe = async (input: RecipeInputDTO): Promise<string> => {
    try {
      const { title, description, createAt } = input;

      if (!title || !description || !createAt) {
        throw new CustomError(
          400,
          'Preencha os campos "title", "description" e "createAt"'
        );
      }

      if (title.length < 2) {
        throw new InvalidName();
      }

      if (description.length <= 10) {
        throw new ShortDescription();
      }

      const recipes = await recipeDatabase.findRecipe(title);

      if (
        recipes &&
        title === recipes.title &&
        description === recipes.description &&
        (await hashManager.compare(title, recipes.title))
      ) {
        throw new RecipeAlreadyExists();
      }

      const id: string = idGenerator.generateId();

      const recipe: recipe = {
        id,
        title,
        description,
        createAt,
      };

      await recipeDatabase.insertRecipe(recipe);

      const token = tokenGenerator.generateToken({ id });

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getrecipeById = async (id: string): Promise<recipe> => {
    try {
      const recipe = await recipeDatabase.getRecipesById(id);

      if (!recipe) {
        throw new RecipeNotFound();
      }

      return recipe;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };
}
