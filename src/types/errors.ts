export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

export type ErrorResponse = {
  error: AppError | null;
};

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as AppError).message === 'string'
  );
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;

  return {
    message: error instanceof Error ? error.message : String(error),
    code: 'UNKNOWN_ERROR'
  };
}
