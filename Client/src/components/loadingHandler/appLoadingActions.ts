export const START_GET = 'START_GET';
export const START_POST = 'START_POST';
export const START_PUT = 'START_PUT';
export const START_DELETE = 'START_DELETE';
export const STOP_GET = 'STOP_GET';
export const STOP_POST = 'STOP_POST';
export const STOP_PUT = 'STOP_PUT';
export const STOP_DELETE = 'STOP_DELETE';

export function startGet() {
    return {
        type: START_GET,
    };
}

export function startPost() {
    return {
        type: START_POST,
    };
}

export function startPut() {
    return {
        type: START_PUT,
    };
}

export function startDelete() {
    return {
        type: START_DELETE,
    };
}

export function stopGet() {
    return {
        type: STOP_GET,
    };
}

export function stopPost() {
    return {
        type: STOP_POST,
    };
}

export function stopPut() {
    return {
        type: STOP_PUT,
    };
}

export function stopDelete() {
    return {
        type: STOP_DELETE,
    };
}
