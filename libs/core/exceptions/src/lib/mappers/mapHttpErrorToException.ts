import { GlobalBaseException } from '../codes/GlobalBaseException';
import { ValidationException } from '../codes/ValidationException';
import { InternalSystemException } from '../codes/InternalSystemException';

export const mapHttpErrorToException = (
  statusCode: number,
  message: string,
  runtimeSnapshot: Record<string, unknown> = {}
): GlobalBaseException => {
  if (statusCode >= 400 && statusCode < 500) {
    return new ValidationException(message, runtimeSnapshot);
  }

  return new InternalSystemException(message, runtimeSnapshot);
};
