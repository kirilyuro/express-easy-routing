import { Request, Response } from 'express';

abstract class Controller {
    public request: Request;
    public response: Response;

    public invokeActionMethod(actionMethod: Function, args: any[]): Promise<any> {
        return new Promise(resolve => {
            resolve(actionMethod.apply(this, args));
        });
    }
}

export default Controller;