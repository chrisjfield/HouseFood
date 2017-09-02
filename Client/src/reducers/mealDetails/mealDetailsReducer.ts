import { MealDetail } from '../../interfaces/mealDetailsInterfaces';
import { 
    GET_MEALDETAILS_STARTED,
    GET_MEALDETAILS_SUCCESSFUL,
    GET_MEALDETAILS_FAILURE,
    DELETE_BULK_MEALDETAILS_SUCCESSFUL,
    PUT_BULK_MEALDETAILS_SUCCESSFUL,
    POST_BULK_MEALDETAILS_SUCCESSFUL,
} from '../../actions/mealDetails/mealDetailActions';

interface mealDetailsReducerState {
    mealDetails: MealDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function mealDetailsReducer(state: mealDetailsReducerState = { 
    mealDetails: undefined, 
    loading: false,
    updating: false,
    error: false,
},                          action: any) {
    switch (action.type) {
    case GET_MEALDETAILS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: action.payload,
            loading: false,
            error: false,
        };
    case GET_MEALDETAILS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case DELETE_BULK_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: [...state.mealDetails
                .filter((mealDetail: MealDetail) => {
                    const wasDeleted: MealDetail = action.payload
                        .find((payload: MealDetail) => payload.mealingredientid === mealDetail.mealingredientid);
                    return wasDeleted ? false : true;
                })],
            loading: false,
            error: false,
        };
    case PUT_BULK_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: [...state.mealDetails
                .map((mealDetail: MealDetail) => {
                    const wasUpdated: MealDetail = action.payload
                        .find((payload: MealDetail) => payload.mealingredientid === mealDetail.mealingredientid);
                    return wasUpdated ? wasUpdated : mealDetail;
                })],
            loading: false,
            error: false,
        };
    case POST_BULK_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: [...state.mealDetails, ...action.payload],
            loading: false,
            error: false,
        };
    default:
        return state;
    }
}
  
export default mealDetailsReducer;
