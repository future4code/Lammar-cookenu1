import { CustomError, UserNotFound } from "../error/customError";
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

  public getUsers = async (id: string): Promise<user> => {
    try {
      const user = await UserDatabase.connection("Cookenu_users")
        .select("id", "name", "email")
        .where({ id })        
      if (!user) {
        throw new UserNotFound();
      }
      return user[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }; 


}
  
 
  
  

