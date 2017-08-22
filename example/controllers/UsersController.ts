import Controller from 'src/Controller';
import User from '../model/User';

type Dictionary<T> = { [index: string]: T };

export default class UsersController extends Controller {

    private static readonly users: Dictionary<User> = {
        '1': new User('1', 'Adam', 'adam@eden.org'),
        '2': new User('2', 'Eve', 'eve@eden.org')
    };

    public getUser(id: string): void {
        if (UsersController.users.hasOwnProperty(id)) {
            this.response.json(UsersController.users[id]);
            return;
        }
        this.response.sendStatus(404);
    }

    public getAllUsers(): void {
        this.response.json(UsersController.users);
    }

    public addUser(user: User): void {
        UsersController.users[user.id] = user;
        this.response.sendStatus(200);
    }

    public deleteUser(id: string): void {
        delete UsersController.users[id];
        this.response.sendStatus(200);
    }
}