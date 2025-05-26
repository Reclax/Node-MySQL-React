import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginUserDto, RegisterUserDto } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
import { AuthDatasourceImpl } from '../datasources/auth.datasource.impl';

export class AuthRepositoryImpl extends AuthRepository {
  private static instance: AuthRepositoryImpl;

  private constructor(private readonly datasource: AuthDatasourceImpl) {
    super();
  }

  static getInstance(datasource: AuthDatasourceImpl) {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl(datasource);
    }
    return AuthRepositoryImpl.instance;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.datasource.login(loginUserDto);
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.datasource.register(registerUserDto);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    // Delegas la consulta al datasource, ajusta el método según tu datasource
    return this.datasource.getAllUsers();
  }
}