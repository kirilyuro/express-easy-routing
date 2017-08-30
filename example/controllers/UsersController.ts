import Controller from 'src/Controller';
import Dictionary from 'src/common/Dictionary';
import User from '../model/User';
import UserNotExistsError from '../exceptions/UserNotExistsError';

export default class UsersController extends Controller {

    private static readonly users: Dictionary<User> = {
        '1': new User('1', 'Adam', 'adam@eden.org'),
        '2': new User('2', 'Eve', 'eve@eden.org')
    };

    public getUser(id: string): User {
        if (UsersController.users.hasOwnProperty(id)) {
            return UsersController.users[id];
        }

        throw new UserNotExistsError(id);
    }

    public getUserAsync(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            resolve(this.getUser(id));
        });
    }

    public getAllUsers(): Dictionary<User> {
        return UsersController.users;
    }

    public addUser(user: User): void {
        UsersController.users[user.id] = user;
    }

    public deleteUser(id: string): void {
        delete UsersController.users[id];
    }
}