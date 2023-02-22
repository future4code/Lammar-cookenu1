import { UserDatabase } from "../data/UserDatabase";
import {
  CustomError,
  InvalidEmail,
  InvalidName,
  InvalidPassword,
  ShortPassword,
  UserAlreadyExists,
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

      const users = await userDatabase.findUser(email);

      if (users && name === users.name && email === users.email && await hashManager.compare(password, users.password)) {
        throw new UserAlreadyExists();
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

      const token = tokenGenerator.generateToken({ id: user.id });

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUsers = async (token: string): Promise<user> =>{
    try {
      if (!token) {
        throw new CustomError(422, "O token deve ser fornecido")
      }

      const userId = tokenGenerator.tokenData(token).id

      const user = await userDatabase.getUsers(userId)

      if (!user) {
        throw new UserNotFound()
      }

      return user
    } catch (error: any) {
      throw new CustomError(400, error.message)
    }
  }

  public getUserById = async (id: string): Promise<user> => {
    try {
      const user = await userDatabase.getUsers(id);
  
      if (!user) {
        throw new UserNotFound();      }
  
      return user;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  }

}
