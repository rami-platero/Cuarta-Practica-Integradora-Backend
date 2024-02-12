export class AppError extends Error{
    constructor(statusCode,message){
        super(JSON.stringify(message));
        this.statusCode = statusCode
    }
}