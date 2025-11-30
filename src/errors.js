export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = 409;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidInputError extends Error {
  errorCode = "INVALID_INPUT";
  statusCode = 400; 

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UnauthorizedError extends Error {
  errorCode = "UNAUTHORIZED";
  statusCode = 401; 

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class ResourceNotFoundError extends Error {
  errorCode = "NOT_FOUND";
  statusCode = 404; 

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InternalServerError extends Error {
  errorCode = "INTERNAL_SERVER_ERROR";
  statusCode = 500; 

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}