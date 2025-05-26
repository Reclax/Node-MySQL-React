import { BcryptAdapter } from '../../config';
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { UserModel } from '../../data/mysql/models/user.model';
import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
  private static instance: AuthDatasourceImpl;

  private constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.getInstance().hash.bind(BcryptAdapter.getInstance()),
    private readonly comparePassword: CompareFunction = BcryptAdapter.getInstance().compare.bind(BcryptAdapter.getInstance()),
  ) {}

  public static getInstance(
    hashPassword: HashFunction = BcryptAdapter.getInstance().hash.bind(BcryptAdapter.getInstance()),
    comparePassword: CompareFunction = BcryptAdapter.getInstance().compare.bind(BcryptAdapter.getInstance())
  ): AuthDatasourceImpl {
    if (!AuthDatasourceImpl.instance) {
      AuthDatasourceImpl.instance = new AuthDatasourceImpl(hashPassword, comparePassword);
    }
    return AuthDatasourceImpl.instance;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) throw CustomError.badRequest('User does not exist - email');

      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) throw CustomError.badRequest('Password is not valid');

      return UserMapper.userEntityFromObject(user.toJSON());
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer();
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      const exists = await UserModel.findOne({ where: { email } });
      if (exists) throw CustomError.badRequest('El usuario ya existe');

      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password),
      });

      return UserMapper.userEntityFromObject(user.toJSON());
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const users = await UserModel.findAll();
      return users.map((user) => UserMapper.userEntityFromObject(user.toJSON()));
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}