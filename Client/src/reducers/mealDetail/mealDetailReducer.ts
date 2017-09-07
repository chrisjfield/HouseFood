import { mealDetailReducerState } from '../../interfaces/stateInterfaces';
import { MealDetail } from '../../interfaces/mealDetailInterfaces';
import { 
    GET_MEALDETAILS_SUCCESSFUL, DELETE_BULK_MEALDETAILS_SUCCESSFUL,
    PUT_BULK_MEALDETAILS_SUCCESSFUL, POST_BULK_MEALDETAILS_SUCCESSFUL,
} from '../../actions/mealDetails/mealDetailActions';

function mealDetailsReducer(state: mealDetailReducerState = { 
    mealDetails: undefined, 
},                          action: any) {
    switch (action.type) {
    case GET_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: action.payload,
        };
    case POST_BULK_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: [...state.mealDetails, ...action.payload],
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
        };
    default:
        return state;
    }
}
  
export default mealDetailsReducer;
