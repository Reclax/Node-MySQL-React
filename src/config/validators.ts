export class Validators {
  private static instance: Validators;
  
  private readonly emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  private constructor() {
  }

  public static getInstance(): Validators {
    if (!Validators.instance) {
      Validators.instance = new Validators();
    }
    return Validators.instance;
  }

  get email() {
    return this.emailRegex;
  }
  
  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }
}