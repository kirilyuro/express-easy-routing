import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import Route from 'src/Route';
import RouteAction from 'src/RouteAction';
import ActionResult from 'src/results/ActionResult';
import Controller from 'src/Controller';
import AuthenticatedCallerController from '../controllers/AuthenticatedCallerController';

abstract class CallerAuthenticatingRoute extends Route {

    protected handleActionRequest(action: RouteAction, request: Request, response: Response): void {
        const callerId: string = CallerAuthenticatingRoute.getCallerId(request);

        if (callerId !== 'admin') {
            const unauthorizedResult = Promise.reject(
                new UnauthorizedCallerError(callerId)
            );

            super.handleActionResult(unauthorizedResult, response);
            return;
        }

        super.handleActionRequest(action, request, response);
    }

    protected initializeController(controller: Controller, request: Request, response: Response): void {
        super.initializeController(controller, request, response);
        (controller as AuthenticatedCallerController).callerId =
            CallerAuthenticatingRoute.getCallerId(request);
    }

    protected configureErrorMappings(): void {
        this.errorMappings[UnauthorizedCallerError.name] = (error =>
            new ActionResult(HttpStatus.UNAUTHORIZED, error.message)
        );
    }

    protected abstract createController(request: Request): AuthenticatedCallerController;

    private static getCallerId(request: Request): string {
        return request.header('Caller-Id');
    }
}

class UnauthorizedCallerError extends Error {
    // Override the default "Error" name.
    public readonly name = UnauthorizedCallerError.name;

    public constructor(
        public callerId: string
    ) {
        super(`Unauthorized access to API by caller "${callerId}"`);
    }
}

export default CallerAuthenticatingRoute;