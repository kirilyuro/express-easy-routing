import { Request } from 'express';
import NamedArgument from './NamedArgument';

export default class FromParamsArgument extends NamedArgument {
    public constructor(name: string) {
        super(name);
    }

    public getValueFrom(request: Request) {
        return request.params[this.name];
    }
}