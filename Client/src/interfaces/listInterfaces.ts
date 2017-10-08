import { Dispatch } from 'redux';

export interface List {
    listid: number;
    name: string; 
    datecreated: Date;
    complete: boolean;
    datecompleted?: Date;
}

export interface NewList {
    name: string; 
    datecreated: Date;
    complete: boolean;
}

export interface GenerateListDetail {
    startDate: Date;
    endDate: Date;
    listName: string;
}

export interface ListsProps {
    lists: List[];
    loading: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
}

export interface ListsState {
    activeList: List;
    completeDialogOpen: boolean;
    showComplete: boolean;
    newListDialogOpen: boolean;
    newList: NewList;
    editListDialogOpen: boolean;
    listEditing: List;
    nameErrorText: string;
    generateListDialogOpen: boolean;
    generateListDetail: GenerateListDetail;
    generateListDialogNameValidation: string;
    generateListDialogStartValidation: string;
    generateListDialogEndValidation: string;
}
