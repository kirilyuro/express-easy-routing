# express-easy-routing
Clean and easy routing with [express](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).  
This library extends express' routing mechanism to allow easy definition and usage of routes and their parameters, with the route handling logic being implemented as pure application logic and indpendent from express.

## Table of Contents
- [express-easy-routing](#express-easy-routing)
  * [Table of Contents](#table-of-contents)
  * [Terminology](#terminology)
  * [Defining a Route](#defining-a-route)
    + [Defining a Route Action](#defining-a-route-action)
    + [Using the Route in the express Application](#using-the-route-in-the-express-application)
  * [Defining a Controller](#defining-a-controller)
    + [Async Controller Methods](#async-controller-methods)
    + [Request and Response in the Controller](#request-and-response-in-the-controller)
  * [Handling Errors](#handling-errors)

## Terminology
***Routes*** are defined by types which extend the `Route` type.  
Each route may define one or more ***Actions***. An action represents an endpoint for client requests, defined by an HTTP request method (GET, POST, and so on), a URI (or path), a handler function and, optionally, some parameters.  
The action requests are handeled by ***Controllers***, which are just plain TypeScript classes which define the handler functions for the actions.

## Defining a Route
A route is defined by a type which extends the abstract `Route` type.  
The concrete route must implement the abstract `getActions` and `createController` methods.
```ts
class UsersRoute extends Route {
  protected getActions(): RouteAction[] { /* ... */ }
  protected createController(): UsersController { /* ... */ }
}
```
The `getActions` method returns a collection of actions exposed from this route:
```ts
protected getActions(): RouteAction[] {
  return [
    new RouteAction( /* ... */),
    /* ... */
    new RouteAction( /* ... */)
  ];
}
```
The `createController` method creates an instance of the controller type. It is called internally for every request, so each request is handled by a new instance of the controller.  
```ts
protected createController(): UsersController {
  return new UsersController();
}
```
If needed, the `createController` method may accept the express' `Request` object as parameter.
```ts
protected createController(request: Request): UsersController {
  /* ... */
}
```
### Defining a Route Action
A route action is defined by:
- An HTTP request method (the possible values are defined in the `HttpMethod` enumeration).
- A URI (or path).
- A handler function - an instance method of the controller type.
- A collection of parameters (optionally).

```ts
new RouteAction(
  HttpMethod.GET, '/:id',
  UsersController.prototype.getUser,
  Arguments(FromRoute('id'))
)
```
Route action parameters may come from several different sources. They may be passed as part of the route, as in the previous example, or they may be passed in the request headers, body, query string, or the whole request body might be the parameter for the action.  
The corresponding argument definition functions are:
```ts
FromRoute('paramName')
FromHeader('headerName')
FromBody('fieldName')
FromQuery('paramName')
RequestBody()
```
The action parameters will be passed to the action handler function in the same order as in the `Arguments(...)` definition.
```ts
// The Arguments definition for the RouteAction:
Arguments(FromRoute('id'), RequestBody())

// The handler method definition in the controller:
public addUser(id: string, user: User): void { /* ... */ }
```

### Using the Route in the express Application
The concrete route exposes a `router` property which returns the express router for that route. This router can then be registered as middleware in the express application.
```ts
const app = express();
app.use('/users', new UsersRoute().router);
```

## Defining a Controller
There is nothing simpler than defining the controller - just write a class which implements the logic which handles the route actions, and extend the `Controller` type.  
The controller does not need to be aware of express, including its `request` and `response` objects. Internally, all parameters will be extracted from the request, and all returned results will be delegated to the response.

### Async Controller Methods
Async controller methods are supported by *Promises* - if the handler function returns a `Promise`, it will first be resolved, and the resolved value will be handled as if returned directly by the handler function. Likewise, an error caught from the promise will be handled in the same manner as an error directly thrown from the handler function.

### Request and Response in the Controller
Although, ideally, the controller should not be aware of express, in some cases the raw `request` and `response` objects may be required in the controller. The base `Controller` type exposes both these objects as public properties which can be used inside the concrete controller.

## Handling Errors
Ideally, the controller should only throw application-level errors rather than HTTP status codes (such as "404 Not Found" and "500 Internal Server Error"). Though, eventually, we would want the route to respond with a "404 Not Found" code if the controller throws a `UserDoesNotExistError`, for example.  
Internally, the `Route` type defines an `errorMappings` property which is a dictionary used by the route to map errors from the controller's handler methods to HTTP status codes and response values. By default, the route will map all (unmapped) errors to "500 Internal Server Error" responses with a JSON representation of the error as the response body.  
The keys in the `errorMappings` dictionary are the names of the errors (i.e. the value of the `name` property of the error type), and the values are functions from error to `ActionResult`. The `ActionResult` is defined by a HTTP status code and, optionally, a response value.
The error mappings can be configured in the route by overriding the `configureErrorMappings` method defined in the `Route` type. There, new error mappings can be added to the `errorMappings` property inherited by the concrete route from the base `Route` type.  
Therefore, for the (`UserDoesNotExistError` => "404 Not Found") example, the error mappings can be configured as:
```ts
protected configureErrorMappings(): void {
  this.errorMappings[UserDoesNotExistError.name] = (error => new ActionResult(HttpStatus.NOT_FOUND));
}
```
