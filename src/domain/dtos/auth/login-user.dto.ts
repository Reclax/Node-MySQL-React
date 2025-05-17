import { Validators } from '../../../config';

export class LoginUserDto {
  constructor(
    public email: string,
    public password: string
  ) {}

  static create( object: { [ key: string ]: any; } ): [ string?, LoginUserDto?] {

    const { email, password } = object;

    const validators = Validators.getInstance();

    if ( !email ) return [ 'email no encontrado' ];
    if ( !validators.isValidEmail(email) ) return [ 'Email no es valido' ];
    if ( !password ) return ['password no encontrado'];
    if ( password.length < 6 ) return ['Password es muy corta'];

    return [
      undefined,
      new LoginUserDto(email, password)
    ];
  }
}