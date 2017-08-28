export interface List {
    listid: number;
    name: string; 
    datecreated: Date;
    complete: boolean;
    datecompleted?: Date;
}

export interface GenerateListDetail {
    startDate: Date;
    endDate: Date;
    listName: string;
}
