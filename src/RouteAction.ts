import { Response } from 'express';
import HttpMethod from './HttpMethod';
import Argument from './arguments/Argument';

type RequestHandlerFunction = ((res: Response, ...params: any[]) => void);

/**
 * A definition of a route action, which consists of:
 * 1) The HTTP method that the route action accepts.
 * 2) The route url prefix.
 * 3) The handler function - a method of the handler class which should be called
 *    to handle a request that matches the route action.
 */
export default class RouteAction {
    public constructor(
        public httpMethod: HttpMethod,
        public url: string,
        public handlerFunc: RequestHandlerFunction,
        public args: Argument[] = []
    ){}
}