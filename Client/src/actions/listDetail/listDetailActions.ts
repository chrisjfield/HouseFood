import { ListDetail } from '../../interfaces/listDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_LISTDETAILS_STARTED = 'GET_LISTDETAILS_STARTED';
export const GET_LISTDETAILS_SUCCESSFUL = 'GET_LISTDETAILS_SUCCESSFUL';
export const GET_LISTDETAILS_FAILURE = 'GET_LISTDETAILS_FAILURE';
export const CHECK_LISTDETAILS_STARTED = 'CHECK_LISTDETAILS_STARTED';
export const CHECK_LISTDETAILS_SUCCESSFUL = 'CHECK_LISTDETAILS_SUCCESSFUL';
export const CHECK_LISTDETAILS_FAILURE = 'CHECK_LISTDETAILS_FAILURE';

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

export function checkListDetail(listDetail: ListDetail) {
    const endpoint = 'listitems/' + String(listDetail.listitemid);
    const updatedListDetail: ListDetail = JSON.parse(JSON.stringify(listDetail));
    updatedListDetail.complete = !updatedListDetail.complete;

    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        updatedListDetail,
      );

    return (dispatch : Function) => {
        dispatch(checkListDetailStarted());
        request
        .then((response : ListDetail) =>
          dispatch(checkListDetailSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(checkListDetailFailure(error));
        });
    };
}

function checkListDetailStarted() {
    return {
        type: CHECK_LISTDETAILS_STARTED,
    };
}

function checkListDetailSuccessful(response: ListDetail) {
    return {
        type: CHECK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

function checkListDetailFailure(error: any) {
    return {
        type: CHECK_LISTDETAILS_FAILURE,
        payload: error,
    };
}
