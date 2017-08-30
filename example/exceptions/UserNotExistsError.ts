export default class UserNotExistsError extends Error {
    // Override the default "Error" name.
    public readonly name = UserNotExistsError.name;

    public constructor(
        public userId: string
    ) {
        super(`Could not find user with id "${userId}"`);
    }
}