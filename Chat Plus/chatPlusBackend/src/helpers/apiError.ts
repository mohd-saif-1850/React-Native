export class ApiError extends Error {
  public statusCode: number;
  public errors: any;

  constructor(statusCode: number, message: string, errors: any = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
