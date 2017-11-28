import { Response } from 'express';
import ActionResult from './ActionResult';
import SuccessResult from './SuccessResult';
import ErrorResult from './ErrorResult';
import ErrorResultMapper from './ErrorResultMapper';
import Dictionary from '../common/Dictionary';

export default class ActionResultHandler {
    public constructor(
        private errorMappings: Dictionary<ErrorResultMapper<any>>,
        private response: Response
    ){}

    public handleResult(result: Promise<any>): void {
        result
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