import Controller from 'src/Controller';
import RouteAction from 'src/RouteAction';
import Http from 'src/HttpMethod';
import { Arguments, FromParams, RequestBody } from 'src/arguments/Arguments';
import UsersHandler from '../handlers/UsersHandler';

export class UsersController extends Controller<UsersHandler> {
    protected getActions(): RouteAction[] {
        return [
            new RouteAction(
                Http.GET, '/:id',
                UsersHandler.prototype.getUser,
                Arguments(FromParams('id'))
            ),
            new RouteAction(
                Http.GET, '/',
                UsersHandler.prototype.getAllUsers
            ),
            new RouteAction(
                Http.POST, '/',
                UsersHandler.prototype.addUser,
                Arguments(RequestBody())
            ),
            new RouteAction(
                Http.DELETE, '/:id',
                UsersHandler.prototype.deleteUser,
                Arguments(FromParams('id'))
            )
        ];
    }

    protected createHandler(): UsersHandler {
        return new UsersHandler();
    }
}