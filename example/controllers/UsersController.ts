import { Controller, RouteAction, HttpMethod as Http } from 'src/Controller';
import UsersHandler from '../handlers/UsersHandler';

export class UsersController extends Controller<UsersHandler> {
    protected getActions(): RouteAction[] {
        return [
            new RouteAction(Http.GET, '/:id', UsersHandler.prototype.getUser),
            new RouteAction(Http.GET, '/', UsersHandler.prototype.getAllUsers),
            new RouteAction(Http.POST, '/', UsersHandler.prototype.addUser),
            new RouteAction(Http.DELETE, '/:id', UsersHandler.prototype.deleteUser)
        ];
    }

    protected createHandler(): UsersHandler {
        return new UsersHandler();
    }
}