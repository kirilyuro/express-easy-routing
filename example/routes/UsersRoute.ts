import * as HttpStatus from 'http-status-codes';
import RouteAction from 'src/RouteAction';
import ActionResult from 'src/results/ActionResult';
import Http from 'src/HttpMethod';
import { Arguments, FromRoute, RequestBody } from 'src/arguments/Arguments';
import CallerAuthenticatingRoute from './CallerAuthenticatingRoute';
import UsersController from '../controllers/UsersController';
import UserNotExistsError from '../exceptions/UserNotExistsError';

export default class UsersRoute extends CallerAuthenticatingRoute {
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

    protected configureErrorMappings(): void {
        super.configureErrorMappings();
        this.errorMappings[UserNotExistsError.name] = (error => new ActionResult(HttpStatus.NOT_FOUND));
    }

    protected createController(): UsersController {
        return new UsersController();
    }
}