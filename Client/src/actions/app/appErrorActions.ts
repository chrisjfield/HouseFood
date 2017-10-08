export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

export function addError(error: Error) {
    const errorText: String = error.message ? error.message : 'An error occurred';
    return {
        type: ADD_ERROR,
        payload: errorText,
    };
}

export function removeError() {
    return {
        type: REMOVE_ERROR,
    };
}
