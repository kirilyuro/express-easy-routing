import ActionResult from './ActionResult';

type ErrorResultMapper<T> = (error: Error) => ActionResult<T>;

export default ErrorResultMapper;