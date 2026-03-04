// src/services/apiErrors.js

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error - please check your connection') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out - please try again') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed - please sign in again') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Server error - please try again later', status = 500) {
    super(message, status);
    this.name = 'ServerError';
  }
}

export const classifyError = (error, response) => {
  if (!response && error.message === 'Network request failed') {
    return new NetworkError();
  }

  if (response) {
    if (response.status === 401 || response.status === 403) {
      return new AuthenticationError();
    }
    if (response.status === 408) {
      return new TimeoutError();
    }
    if (response.status >= 500) {
      return new ServerError(error.message, response.status);
    }
  }

  return new ApiError(error.message, error.status || 0);
};
