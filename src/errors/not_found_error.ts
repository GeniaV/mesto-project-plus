import { NOT_FOUND_STATUS_CODE_ERROR } from '../constants';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_STATUS_CODE_ERROR;
  }
}

export default NotFoundError;
