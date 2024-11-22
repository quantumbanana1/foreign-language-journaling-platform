import { INewUser } from "../Types/UserTypes";

export default class NewUser {
  private id: number;
  private username: string;
  private email: string;
  private password: string;
  private confirmPassword: string;
  private unique_key: string;

  constructor(
    username: string,
    email: string,
    password: string,
    unique_key: string,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.unique_key = unique_key;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getConfirmPassword(): string {
    return this.confirmPassword;
  }

  public setConfirmPassword(confirmPassword: string): void {
    this.confirmPassword = confirmPassword;
  }

  public toString(): string {
    return `User: { id: ${this.id}, username: ${this.username}, email: ${this.email}, password: ${this.password}, confirmPassword: ${this.confirmPassword} }`;
  }

  public returnUserObject(): INewUser {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      unique_key: this.unique_key,
    };
  }
}
