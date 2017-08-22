import { List } from '../../interfaces/listsInterfaces';
import { 
    GET_SHOPPING_LISTS_STARTED,
    GET_SHOPPING_LISTS_SUCCESSFUL,
    GET_SHOPPING_LISTS_FAILURE,
} from '../../actions/lists/listActions';

interface listsReducerState {
    lists: List[];
    loading: boolean;
    error: boolean;
}

function listsReducer(state: listsReducerState = { 
    lists: undefined, 
    loading: false,
    error: false,
},                    action: any) {
    switch (action.type) {
    case GET_SHOPPING_LISTS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_SHOPPING_LISTS_SUCCESSFUL:
        return {
            ...state,
            lists: action.payload,
            loading: false,
            error: false,
        };
    case GET_SHOPPING_LISTS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default listsReducer;
