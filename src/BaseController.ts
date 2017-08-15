import { Router, IRouterMatcher, Request, Response } from 'express';
import { IRouter } from 'express-serve-static-core';

type RequestHandlerFunction = ((req: Request, res: Response) => void);

/**
 * Base class for route controller definitions.
 * Generic type THandler: The type that implements the handling of the requests to this controller.
 */
export abstract class BaseController<THandler> {

    /**
     * Get the express.js router object for this controller.
     * @returns {IRouter}
     */
    public get expressRouter(): IRouter {
        const router: IRouter = Router();
        const actions: RouteAction[] = this.getActions();

        for (const action of actions){
            // Get the matcher method of the router which corresponds
            // to the HTTP method which the action accepts.
            const routeMatcher: IRouterMatcher<IRouter> =
                BaseController.getRouteMatcher(router, action.httpMethod);

            // Invoke the matcher method on the router by matching the action's url
            // and binding the action's handler function to the router.
            // ( This does: router.<get|post|put|...>(action.url, (req, res) => { ... }) )
            routeMatcher.apply(router, [action.url, (req: Request, res: Response) => {
                const handler: THandler = this.createHandler();

                // Invoke the method of the handler which should handler the current action.
                action.handlerFunc.apply(handler, [req, res]);
            }]);
        }

        return router;
    }

    /**
     * Get the RouteMatcher method of express.js Router which corresponds to the given HTTP method.
     * @param {IRouter} router The router object.
     * @param {ExpressHttpMethod} method The HTTP method.
     * @returns {e.IRouterMatcher<IRouter>} The corresponding route matcher.
     */
    private static getRouteMatcher(router: IRouter, method: ExpressHttpMethod): IRouterMatcher<IRouter> {
        switch (method){
            case ExpressHttpMethod.ALL: return router.all;
            case ExpressHttpMethod.OPTIONS: return router.options;
            case ExpressHttpMethod.GET: return router.get;
            case ExpressHttpMethod.HEAD: return router.head;
            case ExpressHttpMethod.POST: return router.post;
            case ExpressHttpMethod.PUT: return router.put;
            case ExpressHttpMethod.DELETE: return router.delete;
            case ExpressHttpMethod.PATCH: return router.patch;
            default: return null;
        }
    }

    /**
     * Get the actions defined for this controller.
     * @returns {RouteAction[]} An array of RouteActions.
     */
    protected abstract getActions(): RouteAction[];

    /**
     * Create an instance of the class that implements the handling of requests to this controller.
     * @returns {THandler} The instance of the handler type.
     * @template THandler
     */
    protected abstract createHandler(): THandler;
}

/**
 * A definition of a route action, which consists of:
 * 1) The HTTP method that the route action accepts.
 * 2) The route url prefix.
 * 3) The handler function - a method of the handler class which should be called
 *    to handle a request that matches the route action.
 */
export class RouteAction {
    public constructor(
        public httpMethod: ExpressHttpMethod,
        public url: string,
        public handlerFunc: RequestHandlerFunction
    ){}
}

export enum ExpressHttpMethod {
    ALL, OPTIONS, GET, HEAD, POST, PUT, DELETE, PATCH
}
