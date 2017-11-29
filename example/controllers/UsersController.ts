import Dictionary from 'express-easy-routing/common/Dictionary';
import AuthenticatedCallerController from './AuthenticatedCallerController';
import User from '../model/User';
import UserNotExistsError from '../exceptions/UserNotExistsError';

export default class UsersController extends AuthenticatedCallerController {

    private static readonly users: Dictionary<User> = {
        '1': new User('1', 'Adam', 'adam@eden.org'),
        '2': new User('2', 'Eve', 'eve@eden.org')
    };

    public getUser(id: string): User {
        this.logCallTo('getUser');

        if (UsersController.users.hasOwnProperty(id)) {
            return UsersController.users[id];
        }

        throw new UserNotExistsError(id);
    }

    public getUserAsync(id: string): Promise<User> {
        this.logCallTo('getUserAsync');

        return new Promise<User>((resolve, reject) => {
            resolve(this.getUser(id));
        });
    }

    public getAllUsers(): Dictionary<User> {
        this.logCallTo('getAllUsers');

        return UsersController.users;
    }

    public addUser(user: User): void {
        this.logCallTo('addUser');

        UsersController.users[user.id] = user;
    }

    public deleteUser(id: string): void {
        this.logCallTo('deleteUser');

        delete UsersController.users[id];
    }

    private logCallTo(methodName: string): void {
        console.log(`Method ${methodName} invoked by caller ${this.callerId}`);
    }
}