/**
 * Serves as the base class for core errors.
 */
export abstract class CoreError extends Error {
    private _innerError: CoreError | undefined;

    /**
     * Initializes the base {SystemError} object.
     *
     * @param message The error message that explains the reason for the error.
     * @param innerError The error that is the cause of the current error.
     */
    constructor(message?: string, innerError?: CoreError) {
        super(message);

        this._innerError = innerError;
    }

    /**
     * Gets the error object that caused the current error.
     *
     * @returns An {Error} object.
     */
    public get innerError(): CoreError | undefined {
        return this._innerError;
    }
}
