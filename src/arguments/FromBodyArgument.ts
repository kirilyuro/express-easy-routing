import { Request } from 'express';
import NamedArgument from './NamedArgument';

export default class FromBodyArgument extends NamedArgument {
    public constructor(name: string) {
        super(name);
    }

    public getValueFrom(request: Request) {
        return request.body[this.name];
    }
}