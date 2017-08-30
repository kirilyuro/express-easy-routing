import { Request, Response } from 'express';
import ActionResult from './results/ActionResult';
import SuccessResult from './results/SuccessResult';
import ErrorResult from './results/ErrorResult';
import ErrorResultMapper from './results/ErrorResultMapper';
import Dictionary from './common/Dictionary';

abstract class Controller {
    public request: Request;
    public response: Response;
    public errorMappings: Dictionary<ErrorResultMapper<any>>;

    public invokeActionMethod(actionMethod: Function, args: any[]): void {
        new Promise(
            resolve => {
                resolve(actionMethod.apply(this, args));
            })
            .then(this.normalizeActionResult)
            .then(this.handleActionResult)
            .catch(this.handleErrorResult);
    }

    private normalizeActionResult = (result: any) => /* ActionResult<any> */ {
        if (result instanceof ActionResult)
            return result;

        return new SuccessResult(result);
    };

    private handleActionResult = (result: ActionResult<any>) => /* void */ {
        if (this.response.finished) return;

        if (result.value instanceof Promise) {
            this.handleAsyncActionResult(result.value);
            return;
        }

        this.response
            .status(result.statusCode)
            .json(result.value);
    };

    private handleAsyncActionResult(result: Promise<any>): void {
        result
            .then(this.handleActionResult)
            .catch(this.handleErrorResult);
    }

    private handleErrorResult = (error: Error) => /* void */ {

        const errorType: string = error.name;
        const result: ActionResult<any> = this.errorMappings.hasOwnProperty(errorType) ?
            this.errorMappings[errorType](error) :
            new ErrorResult(error);

        this.handleActionResult(result);
    }
}

export default Controller;