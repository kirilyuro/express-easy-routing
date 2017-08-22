import { Request, Response } from 'express';

abstract class Controller {
    public request: Request;
    public response: Response;

    public invokeActionMethod(actionMethod: Function, args: any[]): void {
        const actionResult: any = actionMethod.apply(this, args);
        this.handleActionResult(actionResult);
    }

    private handleActionResult(result: any): void {
        if (this.response.finished) return;

        this.response.status(200).json(result);
    }
}

export default Controller;