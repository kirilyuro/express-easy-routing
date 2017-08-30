import ActionResult from './ActionResult';
import * as HttpStatus from 'http-status-codes';

export default class SuccessResult<T> extends ActionResult<T> {
    public constructor(
        public value: T
    ) {
        super(HttpStatus.OK, value);
    }
}