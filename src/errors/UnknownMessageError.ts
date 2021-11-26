export class UnknownMessageError extends Error {
  constructor(
    public netMessageContent: string,
    message?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, UnknownMessageError.prototype);
  }
}
