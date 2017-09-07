import { 
    ListDetail,
    NewListDetail, 
} from '../../interfaces/listDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_LISTDETAILS_STARTED = 'GET_LISTDETAILS_STARTED';
export const GET_LISTDETAILS_SUCCESSFUL = 'GET_LISTDETAILS_SUCCESSFUL';
export const GET_LISTDETAILS_FAILURE = 'GET_LISTDETAILS_FAILURE';
export const CHECK_LISTDETAILS_STARTED = 'CHECK_LISTDETAILS_STARTED';
export const PUT_LISTDETAILS_SUCCESSFUL = 'PUT_LISTDETAILS_SUCCESSFUL';
export const CHECK_LISTDETAILS_FAILURE = 'CHECK_LISTDETAILS_FAILURE';
export const CHECK_ALL_LISTDETAILS_STARTED = 'CHECK_ALL_LISTDETAILS_STARTED';
export const CHECK_ALL_LISTDETAILS_SUCCESSFUL = 'CHECK_ALL_LISTDETAILS_SUCCESSFUL';
export const CHECK_ALL_LISTDETAILS_FAILURE = 'CHECK_ALL_LISTDETAILS_FAILURE';
export const PUT_BULK_LISTDETAILS_SUCCESSFUL = 'PUT_BULK_LISTDETAILS_SUCCESSFUL';
export const DELETE_BULK_LISTDETAILS_SUCCESSFUL = 'DELETE_BULK_LISTDETAILS_SUCCESSFUL';
export const POST_BULK_LISTDETAILS_SUCCESSFUL = 'POST_BULK_LISTDETAILS_SUCCESSFUL';

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
        type: PUT_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

function checkListDetailFailure(error: any) {
    return {
        type: CHECK_LISTDETAILS_FAILURE,
        payload: error,
    };
}

export function checkAllListDetail(checked: boolean, listid: number) {
    const endpoint = 'listitems/bulk/' + String(listid);
    const checkedToJSON: any = JSON.parse(String(checked));

    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        checkedToJSON,
      );

    return (dispatch: Function) => {
        dispatch(checkAllListDetailStarted());
        request
        .then((response: number) =>
          dispatch(checkAllListDetailSuccessful(checked, listid)),
        )
        .catch((error: any) => {
            console.log(error);
            dispatch(checkAllListDetailFailure(error));
        });
    };
}

function checkAllListDetailStarted() {
    return {
        type: CHECK_ALL_LISTDETAILS_STARTED,
    };
}

function checkAllListDetailSuccessful(checked: boolean, listid: number) {
    return {
        checked,
        type: CHECK_ALL_LISTDETAILS_SUCCESSFUL,
        payload: listid,
    };
}

function checkAllListDetailFailure(error: any) {
    return {
        type: CHECK_ALL_LISTDETAILS_FAILURE,
        payload: error,
    };
}

export function putBulkListDetails(listDetails: ListDetail[]) {
    const request = apiHelper.apiCall(
        'PUT',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch : Function) => {
        dispatch(getListDetailsStarted());
        request
        .then((response : ListDetail[]) =>
          dispatch(putBulkListDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListDetailsFailure(error));
        });
    };
}

function putBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: PUT_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function deletetBulkListDetails(listDetails: ListDetail[]) {
    const request = apiHelper.apiCall(
        'DELETE',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch : Function) => {
        dispatch(getListDetailsStarted());
        request
        .then((response : any) =>
          dispatch(deleteBulkListDetailsSuccessful(listDetails)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListDetailsFailure(error));
        });
    };
}

function deleteBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: DELETE_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function postBulkListDetails(listDetails: NewListDetail[]) {
    const request = apiHelper.apiCall(
        'POST',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch : Function) => {
        dispatch(getListDetailsStarted());
        request
        .then((response : ListDetail[]) =>
          dispatch(postBulkListDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListDetailsFailure(error));
        });
    };
}

function postBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: POST_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}
