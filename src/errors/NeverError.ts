export class NeverError extends Error {
  constructor(message: never) {
    super(`Unreachable statement: ${message}`);
  }
}
