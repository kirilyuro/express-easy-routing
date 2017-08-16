import { Request, Response } from 'express';
import User from '../model/User';

type Dictionary<T> = { [index: string]: T };

export default class UsersHandler {

    private static readonly users: Dictionary<User> = {
        '1': new User('1', 'Adam', 'adam@eden.org'),
        '2': new User('2', 'Eve', 'eve@eden.org')
    };

    public getUser(req: Request, res: Response): void {
        const id: string = req.params.id;

        if (UsersHandler.users.hasOwnProperty(id)) {
            res.json(UsersHandler.users[id]);
            return;
        }

        res.sendStatus(404);
    }

    public getAllUsers(req: Request, res: Response): void {
        res.json(UsersHandler.users);
    }

    public addUser(req: Request, res:Response): void {
        const user: User = req.body;

        UsersHandler.users[user.id] = user;

        res.sendStatus(200);
    }

    public deleteUser(req: Request, res: Response): void {
        const id: string = req.params.id;

        delete UsersHandler.users[id];

        res.sendStatus(200);
    }
}