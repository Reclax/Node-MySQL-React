import { JwtAdapter } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
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

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {
  private static instance: RegisterUser;

  private constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.getInstance().generateToken.bind(JwtAdapter.getInstance()),
  ) {}

  public static getInstance(
    authRepository: AuthRepository,
    signToken: SignToken = JwtAdapter.getInstance().generateToken.bind(JwtAdapter.getInstance())
  ): RegisterUser {
    if (!RegisterUser.instance) {
      RegisterUser.instance = new RegisterUser(authRepository, signToken);
    }
    return RegisterUser.instance;
  }

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);
    const token = await this.signToken({ id: user.id }, '2h');
    if (!token) throw CustomError.internalServer('Error de generacion de token');

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }
}
