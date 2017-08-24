import { ListDetail } from '../../interfaces/listDetailInterfaces';
import { 
    GET_LISTDETAILS_STARTED,
    GET_LISTDETAILS_SUCCESSFUL,
    GET_LISTDETAILS_FAILURE,
    CHECK_LISTDETAILS_STARTED,
    CHECK_LISTDETAILS_SUCCESSFUL,
    CHECK_LISTDETAILS_FAILURE,
} from '../../actions/listDetail/listDetailActions';

interface listDetailsReducerState {
    listDetails: ListDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function listDetailsReducer(state: listDetailsReducerState = { 
    listDetails: undefined, 
    loading: false,
    updating: false,
    error: false,
},                          action: any) {
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
    default:
        return state;
    }
}
  
export default listDetailsReducer;
