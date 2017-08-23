import { ListDetail } from '../../interfaces/listDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_LISTDETAILS_STARTED = 'GET_LISTDETAILS_STARTED';
export const GET_LISTDETAILS_SUCCESSFUL = 'GET_LISTDETAILS_SUCCESSFUL';
export const GET_LISTDETAILS_FAILURE = 'GET_LISTDETAILS_FAILURE';

export function getListDetails() {
    const request = apiHelper.apiCall(
        'GET',
        'listitems',
      );
    
    return (dispatch : Function) => {
        dispatch(getListDetailsStarted());
        request
        .then((response : ListDetail[]) =>
          dispatch(getListDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListDetailsFailure(error));
        });
    };
}

function getListDetailsStarted() {
    return {
        type: GET_LISTDETAILS_STARTED,
    };
}

function getListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: GET_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

function getListDetailsFailure(error: any) {
    return {
        type: GET_LISTDETAILS_FAILURE,
        payload: error,
    };
}
