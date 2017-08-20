import { Request } from 'express';

abstract class Argument {
    public abstract getValueFrom(request: Request);
}

export default Argument;