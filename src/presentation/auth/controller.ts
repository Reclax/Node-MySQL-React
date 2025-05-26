import { Request, Response } from 'express';
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from '../../domain';

export class AuthController {
  private static instance: AuthController;

  // DI
  private constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  // Método para obtener la instancia única
  public static getInstance(authRepository: AuthRepository): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController(authRepository);
    }
    return AuthController.instance;
  }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error); // Winston u otro logger
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    RegisterUser.getInstance(this.authRepository)
      .execute(registerUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    LoginUser.getInstance(this.authRepository)
      .execute(loginUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      // Usando el repositorio, que ahora debería devolver un array de usuarios tipados.
      const users = await this.authRepository.getAllUsers();
      res.json({ users });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}