import { Day } from './dayInterfaces';
import { Ingredient } from './ingredientInterfaces';
import { ListDetail } from './listDetailInterfaces';
import { List } from './listInterfaces';
import { Person } from './personInterfaces';
import { Meal } from './mealInterfaces';
import { MealDetail } from './mealDetailInterfaces';

export interface AppState {
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
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface ingredientReducerState {
    ingredients: Ingredient[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface listReducerState {
    lists: List[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface listDetailReducerState {
    listDetails: ListDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface mealReducerState {
    meals: Meal[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface mealDetailReducerState {
    mealDetails: MealDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

export interface personReducerState {
    people: Person[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}
