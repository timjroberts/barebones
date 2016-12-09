import {CoreError} from "./CoreError";

/**
 * Serves as the base class for system errors.
 */
export abstract class SystemError extends CoreError {
    /**
     * Initializes the base {SystemError} object.
     *
     * @param message The error message that explains the reason for the error.
     * @param innerError The error that is the cause of the current error.
     */
    constructor(message?: string, innerError?: CoreError) {
        super(message, innerError);
    }
}
