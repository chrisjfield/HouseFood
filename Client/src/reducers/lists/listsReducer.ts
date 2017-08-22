import { List } from '../../interfaces/listsInterfaces';
import { 
    GET_SHOPPING_LISTS, 
} from '../../actions/lists/listActions';

interface listsReducerState {
    lists: List[];
}

function listsReducer(state: listsReducerState = { 
    lists: undefined, 
},                    action: any) {
    switch (action.type) {
    case GET_SHOPPING_LISTS:
        return {
            ...state,
            lists: action.payload,
        };
    default:
        return state;
    }
}
  
export default listsReducer;
