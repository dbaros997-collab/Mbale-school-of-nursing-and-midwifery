export class AdminFinanceDataError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
  ) {
    super(message);
    this.name = "AdminFinanceDataError";
  }
}
