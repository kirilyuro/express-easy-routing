import ActionResult from './ActionResult';
import * as HttpStatus from 'http-status-codes';

export default class ErrorResult extends ActionResult<JsonSerializableError> {
    public constructor(
        public error: Error
    ) {
        super(
            HttpStatus.INTERNAL_SERVER_ERROR,
            new JsonSerializableError(error)
        );
    }
}

class JsonSerializableError {

    public name: string;
    public message: string;
    public stack?: string;

    public constructor(
        error: Error
    ){
        this.name = error.name;
        this.message = error.message;
        // TODO: Add option to exclude stack from response (for production env).
        this.stack = error.stack;
    }
}