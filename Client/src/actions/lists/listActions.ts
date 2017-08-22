import { List } from '../../interfaces/listsInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_SHOPPING_LISTS_STARTED = 'GET_SHOPPING_LISTS_STARTED';
export const GET_SHOPPING_LISTS_SUCCESSFUL = 'GET_SHOPPING_LISTS_SUCCESSFUL';
export const GET_SHOPPING_LISTS_FAILURE = 'GET_SHOPPING_LISTS_FAILURE';

export function getShoppingLists() {
    const request = apiHelper.apiCall(
        'GET',
        'lists',
      );
    
    return (dispatch : Function) => {
        dispatch(getListsStarted());
        request
        .then((response : List[]) =>
          dispatch(getListsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListsFailure(error));
        });
    };
}

function getListsStarted() {
    return {
        type: GET_SHOPPING_LISTS_STARTED,
    };
}

function getListsSuccessful(response: List[]) {
    return {
        type: GET_SHOPPING_LISTS_SUCCESSFUL,
        payload: response,
    };
}

function getListsFailure(error: any) {
    return {
        type: GET_SHOPPING_LISTS_FAILURE,
        payload: error,
    };
}
