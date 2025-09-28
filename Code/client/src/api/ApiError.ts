export class ApiError extends Error {
    constructor (
        public status: number,
        public details: string
    ) {
        super(`HTTP error. Status: ${status}. ${details}`);
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}