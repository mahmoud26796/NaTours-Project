class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.operationalError = true;

        Error.captureStackTrace(this, this.constructor);
    }
};


module.exports = AppError;