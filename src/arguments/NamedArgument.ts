import Argument from './Argument';

abstract class NamedArgument extends Argument {
    public constructor(
        public name: string
    ) {
        super();
    }
}

export default NamedArgument;