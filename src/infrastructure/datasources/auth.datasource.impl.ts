import { BcryptAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
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
      const user = await UserModel.findOne({ email });
      if (!user) throw CustomError.badRequest('User does not exists - email');

      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) throw CustomError.badRequest('Password is not valid');

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      console.log(error); 
      throw CustomError.internalServer();
    }
  }
  
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      const exists = await UserModel.findOne({ email });
      if (exists) throw CustomError.badRequest('El usuario ya existe');
      
      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserMapper.userEntityFromObject(user);
      
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
