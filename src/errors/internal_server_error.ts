import { INTERNAL_SERVER_ERROR_STATUS_CODE } from '../constants';

class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;
  }
}

export default InternalServerError;
