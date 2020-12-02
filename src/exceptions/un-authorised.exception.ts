export class UnAuthorisedException extends Error {
    constructor() {
        super('UnAuthorised');
    }
}
