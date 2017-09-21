import { Day } from './dayInterfaces';
import { Ingredient } from './ingredientInterfaces';
import { ListDetail } from './listDetailInterfaces';
import { List } from './listInterfaces';
import { Person } from './personInterfaces';
import { Meal } from './mealInterfaces';
import { MealDetail } from './mealDetailInterfaces';

export interface AppStore {
    appReducer: appReducerState;
    dayReducer: dayReducerState; 
    ingredientReducer: ingredientReducerState;
    listReducer: listReducerState;
    listDetailReducer: listDetailReducerState;
    mealReducer: mealReducerState;
    mealDetailReducer: mealDetailReducerState;
    personReducer: personReducerState;
}

export interface appReducerState {
    getting: number;
    posting: number;
    putting: number;
    deleting: number;
    errorMessage: string;
}

export interface dayReducerState {
    days: Day[];
}

export interface ingredientReducerState {
    ingredients: Ingredient[];
}

export interface listReducerState {
    lists: List[];
}

export interface listDetailReducerState {
    listDetails: ListDetail[];
}

export interface mealReducerState {
    meals: Meal[];
}

export interface mealDetailReducerState {
    mealDetails: MealDetail[];
}

export interface personReducerState {
    people: Person[];
}
