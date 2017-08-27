import { Request, Response } from 'express';

abstract class Controller {
    public request: Request;
    public response: Response;

    public invokeActionMethod(actionMethod: Function, args: any[]): void {
        new Promise(
            resolve => {
                resolve(actionMethod.apply(this, args));
            })
            .then(this.handleActionResult)
            .catch(this.handleErrorResult);
    }

    private handleActionResult: ((result: any, statusCode?: number) => void) = (result, statusCode?) => {
        if (this.response.finished) return;

        if (result instanceof Promise) {
            this.handleAsyncActionResult(result);
            return;
        }

        this.response.status(statusCode || 200).json(result);
    };

    private handleAsyncActionResult(result: Promise<any>): void {
        result
            .then(this.handleActionResult)
            .catch(this.handleErrorResult);
    }

    private handleErrorResult: ((error: Error) => void) = error => {
        this.handleActionResult(
            // TODO: Add option to exclude stack from response (for production env).
            new ErrorResult(error.name, error.message, error.stack),
            500
        );
    }
}

class ErrorResult {
    public constructor(
        public name: string,
        public message: string,
        public stack?: string
    ){}
}

export default Controller;