import {
  ApiError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  ServerError,
  classifyError,
} from '../apiErrors';

describe('apiErrors', () => {
  // --- Error classes ---

  describe('NetworkError', () => {
    it('has correct name', () => {
      const error = new NetworkError();
      expect(error.name).toBe('NetworkError');
    });

    it('has correct default message', () => {
      const error = new NetworkError();
      expect(error.message).toBe('Network error - please check your connection');
    });

    it('has status 0', () => {
      const error = new NetworkError();
      expect(error.status).toBe(0);
    });

    it('accepts custom message', () => {
      const error = new NetworkError('Custom network error');
      expect(error.message).toBe('Custom network error');
    });

    it('is instance of ApiError', () => {
      const error = new NetworkError();
      expect(error).toBeInstanceOf(ApiError);
    });

    it('is instance of Error', () => {
      const error = new NetworkError();
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('TimeoutError', () => {
    it('has correct name', () => {
      const error = new TimeoutError();
      expect(error.name).toBe('TimeoutError');
    });

    it('has correct default message', () => {
      const error = new TimeoutError();
      expect(error.message).toBe('Request timed out - please try again');
    });

    it('has status 408', () => {
      const error = new TimeoutError();
      expect(error.status).toBe(408);
    });

    it('is instance of ApiError', () => {
      const error = new TimeoutError();
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('AuthenticationError', () => {
    it('has correct name', () => {
      const error = new AuthenticationError();
      expect(error.name).toBe('AuthenticationError');
    });

    it('has correct default message', () => {
      const error = new AuthenticationError();
      expect(error.message).toBe('Authentication failed - please sign in again');
    });

    it('has status 401', () => {
      const error = new AuthenticationError();
      expect(error.status).toBe(401);
    });

    it('is instance of ApiError', () => {
      const error = new AuthenticationError();
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('ServerError', () => {
    it('has correct name', () => {
      const error = new ServerError();
      expect(error.name).toBe('ServerError');
    });

    it('has correct default message', () => {
      const error = new ServerError();
      expect(error.message).toBe('Server error - please try again later');
    });

    it('has default status 500', () => {
      const error = new ServerError();
      expect(error.status).toBe(500);
    });

    it('accepts custom status', () => {
      const error = new ServerError('Bad gateway', 502);
      expect(error.status).toBe(502);
      expect(error.message).toBe('Bad gateway');
    });

    it('is instance of ApiError', () => {
      const error = new ServerError();
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  // --- classifyError ---

  describe('classifyError()', () => {
    it('returns NetworkError for network request failures without response', () => {
      const error = new Error('Network request failed');
      const result = classifyError(error, null);

      expect(result).toBeInstanceOf(NetworkError);
      expect(result.name).toBe('NetworkError');
      expect(result.status).toBe(0);
    });

    it('returns AuthenticationError for 401 response', () => {
      const error = new Error('Unauthorized');
      const response = { status: 401 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.name).toBe('AuthenticationError');
      expect(result.status).toBe(401);
    });

    it('returns AuthenticationError for 403 response', () => {
      const error = new Error('Forbidden');
      const response = { status: 403 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(AuthenticationError);
    });

    it('returns TimeoutError for 408 response', () => {
      const error = new Error('Timeout');
      const response = { status: 408 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(TimeoutError);
      expect(result.name).toBe('TimeoutError');
      expect(result.status).toBe(408);
    });

    it('returns ServerError for 500 response', () => {
      const error = new Error('Internal server error');
      const response = { status: 500 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(ServerError);
      expect(result.name).toBe('ServerError');
      expect(result.status).toBe(500);
    });

    it('returns ServerError for 502 response', () => {
      const error = new Error('Bad gateway');
      const response = { status: 502 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(ServerError);
      expect(result.status).toBe(502);
    });

    it('returns ServerError for 503 response', () => {
      const error = new Error('Service unavailable');
      const response = { status: 503 };
      const result = classifyError(error, response);

      expect(result).toBeInstanceOf(ServerError);
      expect(result.status).toBe(503);
    });

    it('returns generic ApiError for unclassified errors', () => {
      const error = new Error('Something went wrong');
      error.status = 422;
      const result = classifyError(error, null);

      expect(result).toBeInstanceOf(ApiError);
      expect(result.name).toBe('ApiError');
      expect(result.message).toBe('Something went wrong');
      expect(result.status).toBe(422);
    });

    it('returns generic ApiError with status 0 when error has no status', () => {
      const error = new Error('Unknown error');
      const result = classifyError(error, null);

      expect(result).toBeInstanceOf(ApiError);
      expect(result.status).toBe(0);
    });
  });
});
