import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

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

    private handleActionResult = (result: any, statusCode: number = HttpStatus.OK) => /* void */ {
        if (this.response.finished) return;

        if (result instanceof Promise) {
            this.handleAsyncActionResult(result);
            return;
        }

        this.response.status(statusCode).json(result);
    };

    private handleAsyncActionResult(result: Promise<any>): void {
        result
            .then(this.handleActionResult)
            .catch(this.handleErrorResult);
    }

    private handleErrorResult = (error: Error) => /* void */ {
        this.handleActionResult(
            // TODO: Add option to exclude stack from response (for production env).
            new ErrorResult(error.name, error.message, error.stack),
            HttpStatus.INTERNAL_SERVER_ERROR
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