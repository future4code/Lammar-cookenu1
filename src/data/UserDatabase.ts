import { CustomError } from "../error/customError";
import { user } from "../model/user";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public insertUser = async (user: user) => {
    try {
      await UserDatabase.connection
        .insert(user)
        .into("Cookenu_users");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public findUser = async (email: string) => {
    try {
      const result = await UserDatabase.connection("Cookenu_users")
        .select()
        .where({ email });

      return result[0];
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  }

  public getUsers = async (): Promise<user[]> => {
    try {
      //inia conexão
      UserDatabase.connection;  

      const getUsers = await UserDatabase.connection
        .select("id", "name", "email")
        .from("Cookenu_users");

      return getUsers;
    } catch (error: any) {
      throw new Error(error.message);
    } 
  };

 
  }
  
