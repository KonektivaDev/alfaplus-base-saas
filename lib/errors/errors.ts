export const ERROR_CODE = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  UNEXPECTED: "UNEXPECTED",
  UNHANDLED: "UNHANDLED",
  VALIDATION: "VALIDATION",
  CONFLICT: "CONFLICT",
  NO_ACTIVE_ORGANIZATION: "NO_ACTIVE_ORGANIZATION",
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export type AppError<C extends ErrorCode = ErrorCode> = {
  code: C;
  message: string;
  details?: Record<string, unknown>;
};

export type Result<S, E extends AppError = AppError> = [E, null] | [null, S];

export function ok<S>(data: S): Result<S, never> {
  return [null, data];
}

export function err<C extends ErrorCode>(
  code: C,
  message: string,
  details?: Record<string, unknown>,
): Result<never, AppError<C>> {
  return [{ code, message, details }, null];
}

export function matchError<C extends ErrorCode, R>(
  error: AppError<C>,
  handlers: Record<C, (error: AppError<C>) => R>,
): R {
  return handlers[error.code](error);
}
