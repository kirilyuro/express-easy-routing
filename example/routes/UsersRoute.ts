import Route from 'src/Route';
import RouteAction from 'src/RouteAction';
import Http from 'src/HttpMethod';
import { Arguments, FromRoute, RequestBody } from 'src/arguments/Arguments';
import UsersController from '../controllers/UsersController';

export default class UsersRoute extends Route {
    protected getActions(): RouteAction[] {
        return [
            new RouteAction(
                Http.GET, '/:id',
                UsersController.prototype.getUser,
                Arguments(FromRoute('id'))
            ),
            new RouteAction(
                Http.GET, '/async/:id',
                UsersController.prototype.getUserAsync,
                Arguments(FromRoute('id'))
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
                Arguments(FromRoute('id'))
            )
        ];
    }

    protected createController(): UsersController {
        return new UsersController();
    }
}