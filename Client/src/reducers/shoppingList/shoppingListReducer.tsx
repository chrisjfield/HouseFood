interface shoppingListReducerState {
    isTicked: boolean;
}

function shoppingListReducer(state: shoppingListReducerState = { 
    isTicked: false, 
},                           action: any) {
    switch (action.type) {
    default:
        return state;
    }
}
  
export default shoppingListReducer;
