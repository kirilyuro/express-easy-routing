import { Request, Response } from 'express';

abstract class Controller {
    public request: Request;
    public response: Response;
}

export default Controller;