import { Request, Response } from "express";
import { RecipeBusiness } from "../business/RecipeBusiness";
import { RecipeInputDTO } from "../model/recipe";

export class RecipeController {
  public create = async (req: Request, res: Response) => {
    try {
      const { title, description, createAt } = req.body;

      const input: RecipeInputDTO = {
        title,
        description,
        createAt,
      };

      const recipeBusiness = new RecipeBusiness();

      const token = await recipeBusiness.createRecipe(input);

      res.status(201).send({ message: "Receita criada!", token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public getRecipeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const recipeBusiness = new RecipeBusiness();
      const recipe = await recipeBusiness.getrecipeById(id);

      res.status(200).send(recipe);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };
}
