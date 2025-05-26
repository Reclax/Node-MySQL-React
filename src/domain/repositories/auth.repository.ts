import { UserEntity } from '../entities/user.entity';
import { LoginUserDto, RegisterUserDto } from '..';

export abstract class AuthRepository {

  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

  // Agrega este método para soportar getUsers en el controlador
  abstract getAllUsers(): Promise<UserEntity[]>;
}

