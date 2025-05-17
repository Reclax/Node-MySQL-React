import { JwtAdapter } from '../../../config';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
  private static instance: LoginUser;

  private constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtAdapter: JwtAdapter = JwtAdapter.getInstance(),
  ) {}

  public static getInstance(
    authRepository: AuthRepository
  ): LoginUser {
    if (!LoginUser.instance) {
      LoginUser.instance = new LoginUser(authRepository);
    }
    return LoginUser.instance;
  }

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    // Crear usuario
    const user = await this.authRepository.login(loginUserDto);

    // Token - Usamos la instancia de JwtAdapter para generar el token
    const token = await this.jwtAdapter.generateToken({ id: user.id }, '2h');
    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }
}