import { Request, Response } from 'express';
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from '../../domain';
import { UserModel } from '../../data/mongodb';

export class AuthController {
  private static instance: AuthController;
  
  // DI
  private constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  // Método para obtener la instancia unica
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

    console.log(error); // Winston
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
    
    // Usando el Singleton de RegisterUser
    RegisterUser.getInstance(this.authRepository)
      .execute(registerUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
    
    // Usando el Singleton de LoginUser
    LoginUser.getInstance(this.authRepository)
      .execute(loginUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then(users => {
        res.json({
          // users,
          user: req.body.user
        }) 
      })
      .catch(() => res.status(500).json({ error: 'Internal server error' }))
  }
}