import { Request } from 'express';
import Argument from './Argument';

export default class RequestBodyArgument extends Argument {
    public getValueFrom(request: Request) {
        return request.body;
    }
}