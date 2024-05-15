export class AppError extends Error{
    constructor({name, code, cause, message}){
        super(message);
        this.name = name
        this.code = code
        this.cause = cause
    }
}