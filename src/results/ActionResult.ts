export default class ActionResult<T> {
    public constructor(
        public statusCode: number,
        public value?: T
    ) {}
}