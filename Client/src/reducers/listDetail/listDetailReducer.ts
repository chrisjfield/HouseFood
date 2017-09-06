import { ListDetail } from '../../interfaces/listDetailInterfaces';
import { 
    GET_LISTDETAILS_STARTED,
    GET_LISTDETAILS_SUCCESSFUL,
    GET_LISTDETAILS_FAILURE,
    CHECK_LISTDETAILS_STARTED,
    CHECK_LISTDETAILS_SUCCESSFUL,
    CHECK_LISTDETAILS_FAILURE,
    CHECK_ALL_LISTDETAILS_STARTED,
    CHECK_ALL_LISTDETAILS_SUCCESSFUL,
    CHECK_ALL_LISTDETAILS_FAILURE,
    DELETE_BULK_LISTDETAILS_SUCCESSFUL,
    POST_BULK_LISTDETAILS_SUCCESSFUL,
    PUT_BULK_LISTDETAILS_SUCCESSFUL,
} from '../../actions/listDetail/listDetailActions';

interface listDetailsReducerState {
    listDetails: ListDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function listDetailReducer(state: listDetailsReducerState = { 
    listDetails: undefined, 
    loading: false,
    updating: false,
    error: false,
},                         action: any) {
    switch (action.type) {
    case GET_LISTDETAILS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: action.payload,
            loading: false,
            error: false,
        };
    case GET_LISTDETAILS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case CHECK_LISTDETAILS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case CHECK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails:  state.listDetails.map((listDetails: ListDetail) => 
                listDetails.listitemid === action.payload.listitemid ? action.payload : listDetails),
            loading: false,
            error: false,
        };
    case CHECK_LISTDETAILS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case CHECK_ALL_LISTDETAILS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case CHECK_ALL_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails:  state.listDetails.map((listDetails: ListDetail) => {
                const newListDetails: ListDetail = JSON.parse(JSON.stringify(listDetails));
                if (newListDetails.listid === action.payload) {
                    newListDetails.complete = action.checked;
                }
                return newListDetails;
            }),
            loading: false,
            error: false,
        };
    case CHECK_ALL_LISTDETAILS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case DELETE_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails
                .filter((listDetail: ListDetail) => {
                    const wasDeleted: ListDetail = action.payload
                        .find((payload: ListDetail) => payload.listitemid === listDetail.listitemid);
                    return wasDeleted ? false : true;
                })],
            loading: false,
            error: false,
        };
    case PUT_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails
                .map((listDetails: ListDetail) => {
                    const wasUpdated: ListDetail = action.payload
                        .find((payload: ListDetail) => payload.listitemid === listDetails.listitemid);
                    return wasUpdated ? wasUpdated : listDetails;
                })],
            loading: false,
            error: false,
        };
    case POST_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails, ...action.payload],
            loading: false,
            error: false,
        };
    default:
        return state;
    }
}
  
export default listDetailReducer;
