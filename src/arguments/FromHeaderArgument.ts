import { Request } from 'express';
import NamedArgument from './NamedArgument';

export default class FromHeaderArgument extends NamedArgument {
    public constructor(name: string) {
        super(name);
    }

    public getValueFrom(request: Request) {
        return request.header(this.name);
    }
}