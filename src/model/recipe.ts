export type recipe = {
  id: string;
  title: string;
  description: string;
  createAt: string;
};

export interface RecipeInputDTO {
  title: string;
  description: string;
  createAt: string;
}

export interface EditRecipeInput {
  title: string;
  id: string;
}

export interface AuthenticationData {
  id: string;
}
