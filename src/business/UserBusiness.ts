import { UserDatabase } from "../data/UserDatabase";
import {
  CustomError,
  InvalidEmail,
  InvalidName,
  InvalidPassword,
  ShortPassword,
  UserNotFound,
} from "../error/customError";
import { LoginInputDTO, user, UserInputDTO } from "../model/user";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";

const idGenerator = new IdGenerator();
const tokenGenerator = new TokenGenerator();
const hashManager = new HashManager();
const userDatabase = new UserDatabase();

export class UserBusiness {
  public createUser = async (input: UserInputDTO): Promise<string> => {
    try {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "name", "email" e "password"'
        );
      }

      if (name.length < 2) {
        throw new InvalidName();
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      if (password.length <= 6) {
        throw new ShortPassword();
      }

      const id: string = idGenerator.generateId();

      const hashPassword: string = await hashManager.hash(password);

      const user: user = {
        id,
        name,
        email,
        password: hashPassword,
      };

      await userDatabase.insertUser(user);

      const token = tokenGenerator.generateToken({ id });

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };
  
  public login = async (input: LoginInputDTO): Promise<string> => {
    try {
      const { email, password } = input;

      if (!email || !password) {
        throw new CustomError(400, 'Preencha os campos"email" e "password"');
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }   
      const user = await userDatabase.findUser(email);
      
      if (!user) {
        throw new UserNotFound();
      }

      const isValidPassword: boolean = await hashManager.compare(
        password,
        user.password
      );

      if (!isValidPassword) {
        throw new InvalidPassword();
      }

      const token = tokenGenerator.generateToken({id:user.id});


      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUsers = async (token: string) => {
    //instanciar fora do try  
    try {
       const userDatabase = new UserDatabase()
       
       if (!token) {
        throw new UserNotFound();
       }
      
       console.log("estou aki"); 
       return await userDatabase.getUsers();
       
    } catch (error: any) {
       throw new Error(error.message)
    }
 }
 

}