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
