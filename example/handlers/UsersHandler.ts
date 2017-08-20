import { Response } from 'express';
import User from '../model/User';

type Dictionary<T> = { [index: string]: T };

export default class UsersHandler {

    private static readonly users: Dictionary<User> = {
        '1': new User('1', 'Adam', 'adam@eden.org'),
        '2': new User('2', 'Eve', 'eve@eden.org')
    };

    public getUser(res: Response, id: string): void {
        if (UsersHandler.users.hasOwnProperty(id)) {
            res.json(UsersHandler.users[id]);
            return;
        }
        res.sendStatus(404);
    }

    public getAllUsers(res: Response): void {
        res.json(UsersHandler.users);
    }

    public addUser(res: Response, user: User): void {
        UsersHandler.users[user.id] = user;
        res.sendStatus(200);
    }

    public deleteUser(res: Response, id: string): void {
        delete UsersHandler.users[id];
        res.sendStatus(200);
    }
}