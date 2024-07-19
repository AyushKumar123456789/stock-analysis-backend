class AppError extends Error {
    statusCode;

    constructor(name, statusCode, message) {
        super(message);

        this.name = name;
        this.statusCode = statusCode;
    }
}

class UserNotFoundError extends AppError {
    constructor(message = 'User not found') {
        super('USER_NOT_FOUND', 404, message);
    }
}

class UserAlreadyExistsError extends AppError {
    constructor(message = 'User already exists') {
        super('USER_ALREADY_EXISTS', 409, message);
    }
}

class InvalidCredentialsError extends AppError {
    constructor(message = 'Invalid credentials') {
        super('INVALID_CREDENTIALS', 401, message);
    }
}

class RequiredTokenError extends AppError {
    constructor(message = 'Missing token') {
        super('REQUIRED_TOKEN', 400, message);
    }
}

class AuthenticationRequiredError extends AppError {
    constructor(message = 'Authentication required') {
        super('AUTHENTICATION_REQUIRED', 401, message);
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'You are not authorized to perform this action') {
        super('UNAUTHORIZED', 403, message);
    }
}

module.exports = {
    AppError,
    UserNotFoundError,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    RequiredTokenError,
    AuthenticationRequiredError,
    AuthorizationError,
};
