import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import Route from 'express-easy-routing/Route';
import ActionResult from 'express-easy-routing/results/ActionResult';
import Controller from 'express-easy-routing/Controller';
import AuthenticatedCallerController from '../controllers/AuthenticatedCallerController';

abstract class CallerAuthenticatingRoute extends Route {

    protected initializeController(controller: Controller, request: Request, response: Response): void {
        (controller as AuthenticatedCallerController).callerId =
            CallerAuthenticatingRoute.authenticateCaller(request);

        super.initializeController(controller, request, response);
    }

    protected configureErrorMappings(): void {
        this.errorMappings[UnauthorizedCallerError.name] = (error =>
            new ActionResult(HttpStatus.UNAUTHORIZED, error.message)
        );
    }

    protected abstract createController(request: Request): AuthenticatedCallerController;

    private static authenticateCaller(request: Request) {
        const callerId: string = request.header('Caller-Id');

        if (callerId !== 'admin') {
            throw new UnauthorizedCallerError(callerId);
        }

        return callerId;
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