import Argument from './Argument';
import RequestBodyArgument from './RequestBodyArgument';
import FromBodyArgument from './FromBodyArgument';
import FromParamsArgument from './FromParamsArgument';
import FromQueryArgument from './FromQueryArgument';
import FromHeaderArgument from './FromHeaderArgument';

export function RequestBody(): Argument {
    return new RequestBodyArgument();
}

export function FromBody(name: string): Argument {
    return new FromBodyArgument(name);
}

export function FromParams(name: string): Argument {
    return new FromParamsArgument(name);
}

export function FromQuery(name: string): Argument {
    return new FromQueryArgument(name);
}

export function FromHeader(name: string): Argument {
    return new FromHeaderArgument(name);
}

export function Arguments(...args: Argument[]): Argument[] {
    return args;
}