import { AuthDatasource, AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';

export class AuthRepositoryImpl implements AuthRepository {
  private static instance: AuthRepositoryImpl;
  
  private constructor(
    private readonly authDatasource: AuthDatasource,
  ) {}

  public static getInstance(authDatasource: AuthDatasource): AuthRepositoryImpl {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl(authDatasource);
    }
    return AuthRepositoryImpl.instance;
  }

  login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authDatasource.login(loginUserDto);
  }
  
  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDatasource.register(registerUserDto);
  }
}