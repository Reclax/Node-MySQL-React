import { Validators } from '../../../config';

export class RegisterUserDto {

  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    const validators = Validators.getInstance();

    if (!name) return ['name no encontrado'];
    if (!email) return ['email no encontrado'];
    if (!validators.isValidEmail(email)) return ['Email no es válido'];
    if (!password) return ['password no encontrado'];
    if (password.length < 6) return ['Password es muy corta'];

    return [
      undefined,
      new RegisterUserDto(name, email, password)
    ];
  }
}
