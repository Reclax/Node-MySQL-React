import { CustomError, UserEntity } from '../../domain';

export class UserMapper {
  
  static userEntityFromObject(object: { [key: string]:any }) {
    const { id, _id, name, email, password } = object;

    if (!_id && !id) {
      throw CustomError.badRequest('id no encontrado');
    }

    if (!name) throw CustomError.badRequest('name no encontrado');
    if (!email) throw CustomError.badRequest('email no encontrado');
    if (!password) throw CustomError.badRequest('password no encontrado');

    return new UserEntity(
      _id || id,
      name, 
      email,
      password
    );
  }
}

