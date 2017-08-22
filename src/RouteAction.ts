import HttpMethod from './HttpMethod';
import Argument from './arguments/Argument';

/**
 * A definition of a route action, which consists of:
 * 1) The HTTP method that the route action accepts.
 * 2) The route url prefix.
 * 3) The controller method - a method of the controller that should be called
 *    to handle a request that matches the route action.
 * 4) The arguments for this route action.
 */
export default class RouteAction {
    public constructor(
        public httpMethod: HttpMethod,
        public url: string,
        public controllerFunc: Function,
        public args: Argument[] = []
    ){}
}