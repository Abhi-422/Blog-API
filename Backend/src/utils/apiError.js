class ApiError extends Error {
    constructor(
        statusCode,
        message = "Internal Server Error",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.status = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        if(stack){
            this.stack = stack; 
        }
    }
    
}

export {ApiError}; 