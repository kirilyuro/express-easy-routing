import { Router, IRouterMatcher, Request, Response } from 'express';
import { IRouter } from 'express-serve-static-core';
import Controller from './Controller';
import HttpMethod from './HttpMethod';
import RouteAction from './RouteAction';
import Argument from './arguments/Argument';

/**
 * Base class for route definitions.
 */
abstract class Route {

    /**
     * Get the express.js router for this route.
     * @returns {IRouter}
     */
    public get router(): IRouter {
        const router: IRouter = Router();
        const actions: RouteAction[] = this.getActions();

        for (const action of actions){
            // Get the matcher method of the router which corresponds
            // to the HTTP method which the action accepts.
            const routeMatcher: IRouterMatcher<IRouter> =
                Route.getRouteMatcher(router, action.httpMethod);

            // Invoke the matcher method on the router by matching the action's url
            // and binding the action's handler function to the controller.
            // ( This does: router.<get|post|put|...>(action.url, (req, res) => { ... }) )
            routeMatcher.apply(router, [action.url, (req: Request, res: Response) => {
                const controller: Controller = this.initializeController(req, res);
                const args: any[] = Route.getArgumentValues(action.args, req);

                // Invoke the method of the controller that handles the current action.
                action.controllerFunc.apply(controller, args);
            }]);
        }

        return router;
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
     * Initialize a new controller instance for the given request.
     * @param {Request} req The request.
     * @param {e.Response} res The response handles of the request.
     * @returns {Controller} A new controller instance.
     */
    private initializeController(req: Request, res: Response): Controller {
        const controller: Controller = this.createController(req);
        controller.request = req;
        controller.response = res;
        return controller;
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
}

export default Route;