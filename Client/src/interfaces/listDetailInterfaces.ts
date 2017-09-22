import { Dispatch } from 'redux';

import { List } from './listInterfaces';
import { Ingredient } from './ingredientInterfaces';

export interface ListDetail {
    listitemid: number;
    listid: number;
    ingredientid: number; 
    amount: number;
    complete: boolean;
}

export interface NewListDetail {
    listid: number; 
    ingredientid: number;
    amount: number;
}

export interface NewListItem {
    uniqueKey: string;
    ingredient: string;
    amount: number;
    unit: string;
}

export interface ListDetailsProps {
    lists: List[];
    listDetails: ListDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    loading: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

export interface ListDetailsState {
    filterdList: List;
    filterdListDetails: ListDetail[];
    listid: number;
    allChecked: boolean;
    listComplete: boolean;
    alreadyAllChecked: boolean;
    completeDialogOpen: boolean;
}

export interface ListEditProps {
    lists: List[];
    listDetails: ListDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    loading: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

export interface ListEditState {
    filterdList: List;
    filterdListDetails: ListDetail[];
    updatedListDetails: ListDetail[];
    deletedListDetails: ListDetail[];
    newListDetails: NewListItem[];
    listid: number;
    newDetailKey: number;
    ingredientList: string[];
    lastRowKey: string;
}
