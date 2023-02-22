import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO, UserInputDTO } from "../model/user";

export class UserController {
  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const input: UserInputDTO = {
        name,
        email,
        password,
      };

      const userBusiness = new UserBusiness();

      const token = await userBusiness.createUser(input);

      res.status(201).send({ message: "Usuário criado!", token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: LoginInputDTO = {
        email,
        password,
      };

      const userBusiness = new UserBusiness();
      const token = await userBusiness.login(input);

      res.status(200).send({ message: "Usuário logado!", token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public getUsers = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const userBusiness = new UserBusiness();
      const users = await userBusiness.getUsers(token);

      res.status(201).send(users);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userBusiness = new UserBusiness();
      const user = await userBusiness.getUserById(id);

      res.status(200).send(user);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };
}
