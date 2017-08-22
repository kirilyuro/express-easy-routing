import Route from 'src/Route';
import RouteAction from 'src/RouteAction';
import Http from 'src/HttpMethod';
import { Arguments, FromParams, RequestBody } from 'src/arguments/Arguments';
import UsersController from '../controllers/UsersController';

export default class UsersRoute extends Route {
    protected getActions(): RouteAction[] {
        return [
            new RouteAction(
                Http.GET, '/:id',
                UsersController.prototype.getUser,
                Arguments(FromParams('id'))
            ),
            new RouteAction(
                Http.GET, '/async/:id',
                UsersController.prototype.getUserAsync,
                Arguments(FromParams('id'))
            ),
            new RouteAction(
                Http.GET, '/',
                UsersController.prototype.getAllUsers
            ),
            new RouteAction(
                Http.POST, '/',
                UsersController.prototype.addUser,
                Arguments(RequestBody())
            ),
            new RouteAction(
                Http.DELETE, '/:id',
                UsersController.prototype.deleteUser,
                Arguments(FromParams('id'))
            )
        ];
    }

    protected createController(): UsersController {
        return new UsersController();
    }
}