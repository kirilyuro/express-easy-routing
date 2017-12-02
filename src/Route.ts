import { Router, IRouterMatcher, Request, Response } from 'express';
import { IRouter } from 'express-serve-static-core';
import Controller from './Controller';
import HttpMethod from './HttpMethod';
import RouteAction from './RouteAction';
import Argument from './arguments/Argument';
import ErrorResultMapper from './results/ErrorResultMapper';
import ActionResultHandler from './results/ActionResultHandler';
import Dictionary from './common/Dictionary';

/**
 * Base class for route definitions.
 */
abstract class Route {

    protected readonly errorMappings: Dictionary<ErrorResultMapper<any>> = {};

    /**
     * Get the express.js router for this route.
     * @returns {IRouter}
     */
    public get router(): IRouter {
        const router: IRouter = Router();
        const actions: RouteAction[] = this.getActions();
        this.configureErrorMappings();

        for (const action of actions){
            // Get the matcher method of the router which corresponds
            // to the HTTP method which the action accepts.
            const routeMatcher: IRouterMatcher<IRouter> =
                Route.getRouteMatcher(router, action.httpMethod);

            // Invoke the matcher method on the router by matching the action's url
            // and binding the action's handler function to the controller.
            // ( This does: router.<get|post|put|...>(action.url, (req, res) => { ... }) )
            routeMatcher.apply(router,
                [action.url, this.handleActionRequest.bind(this, action)]
            );
        }

        return router;
    }

    /**
     * Handle a request for a given action.
     * @param {RouteAction} action The requested route action.
     * @param {e.Request} req The request object.
     * @param {e.Response} res The response handler of the request.
     */
    protected handleActionRequest(action: RouteAction, req: Request, res: Response): void {
        const actionResult: Promise<any> =
            this.invokeActionHandler(action, req, res);

        this.handleActionResult(actionResult, res);
    }

    /**
     * Invoke the action method on this route's controller corresponding to the given route action.
     * @param {RouteAction} action The route action.
     * @param {Request} req The express request object.
     * @param {Response} res The express response handler object.
     * @returns {Promise} The result of the invocation of the action method.
     */
    protected invokeActionHandler(action: RouteAction, req: Request, res: Response): Promise<any> {
        return new Promise(resolve => {
            const controller: Controller = this.createController(req);
            this.initializeController(controller, req, res);
            const args: any[] = Route.getArgumentValues(action.args, req);

            // Invoke the method of the controller that handles the current action.
            const actionResult = controller.invokeActionMethod(action.controllerFunc, args);

            resolve(actionResult);
        });
    }

    /**
     * Handle the result of an action.
     * @param {Promise} actionResult The action result promise.
     * @param {e.Response} res The response handler object.
     */
    protected handleActionResult(actionResult: Promise<any>, res: Response): void {
        new ActionResultHandler(this.errorMappings, res)
            .handleResult(actionResult);
    }

    /**
     * Get the RouteMatcher method of express.js Router which corresponds to the given HTTP method.
     * @param {IRouter} router The router object.
     * @param {HttpMethod} method The HTTP method.
     * @returns {e.IRouterMatcher<IRouter>} The corresponding route matcher.
     */
    private static getRouteMatcher(router: IRouter, method: HttpMethod): IRouterMatcher<IRouter> {
        switch (method){
            case HttpMethod.ALL: return router.all;
            case HttpMethod.OPTIONS: return router.options;
            case HttpMethod.GET: return router.get;
            case HttpMethod.HEAD: return router.head;
            case HttpMethod.POST: return router.post;
            case HttpMethod.PUT: return router.put;
            case HttpMethod.DELETE: return router.delete;
            case HttpMethod.PATCH: return router.patch;
            default: return null;
        }
    }

    /**
     * Initialize the given controller instance.
     * @param {Controller} controller The controller being initialized.
     * @param {Request} req The request.
     * @param {e.Response} res The response handler of the request.
     */
    protected initializeController(controller: Controller, req: Request, res: Response): void {
        controller.request = req;
        controller.response = res;
    }

    /**
     * Get the argument values defined by args from the given request.
     * @param {Argument[]} args The argument definitions.
     * @param {Request} req The request object.
     * @returns {Array} The argument values.
     */
    private static getArgumentValues(args: Argument[], req: Request): any[] {
        return args.map(argument =>
            argument.getValueFrom(req)
        );
    }

    /**
     * Get the actions defined for this route.
     * @returns {RouteAction[]} An array of RouteActions.
     */
    protected abstract getActions(): RouteAction[];

    /**
     * Create an instance of the controller that handles this route for the given request.
     * @param {Request} request The request.
     * @returns {Controller} The controller instance.
     */
    protected abstract createController(request: Request): Controller;

    /**
     * Configure the mappings of application errors to action results.
     */
    protected configureErrorMappings(): void {}
}

export default Route;