import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { 
    ListDetail, 
    NewListItem,
    NewListDetail, 
} from '../../../interfaces/listDetailInterfaces';
import { 
    Ingredient,
    NewIngredient, 
} from '../../../interfaces/ingredientInterfaces';

import { 
    getListDetails,
    deletetBulkListDetails,
    putBulkListDetails, 
    postBulkListDetails,
} from '../../../actions/listDetail/listDetailActions';

import { 
    getIngredients,
    postBulkIngredients, 
} from '../../../actions/ingredient/ingredientActions';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Delete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';

interface ListEditProps {
    listDetails: ListDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

interface ListEditState {
    filterdListDetails: ListDetail[];
    updatedListDetails: ListDetail[];
    deletedListDetails: ListDetail[];
    newListDetails: NewListItem[];
    listid: number;
    newDetailKey: number;
    ingredientList: string[];
    lastRowKey: string;
}

class ListEdit extends React.Component<ListEditProps, ListEditState> {
    constructor(props: any) {
        super();

        this.state = {
            filterdListDetails: [],
            updatedListDetails: [],
            deletedListDetails: [],
            listid: undefined,
            newListDetails: [{
                uniqueKey: 'new1',
                ingredient: '',
                amount: 0,
                unit: '',
            }],
            newDetailKey: 2,
            ingredientList: [],
            lastRowKey: 'new1',
        };
    }

    componentWillMount() {
        this.props.dispatch(getListDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: ListEditProps) {
        const listid: number =  Number(nextProps.match.params.listid);
        const filterdListDetails: ListDetail[] = nextProps.listDetails 
            ? nextProps.listDetails.filter((listDetail: ListDetail) => listDetail.listid === listid) 
            : []; 
        const updatedListDetails: ListDetail[] = (this.state && this.state.updatedListDetails.length !== 0)
            ? this.state.updatedListDetails
            : [...filterdListDetails];
        const ingredientList = nextProps.ingredients 
            ? [...new Set<string>(nextProps.ingredients.map((ingredient: Ingredient) => ingredient.name.toLowerCase()))]
            : []; 

        this.setState({
            listid,
            filterdListDetails, 
            updatedListDetails,
            ingredientList,
        });
    }

    getNewTableRows = () => {
        return this.state.newListDetails
            .map((newListItem: NewListItem) => this.createNewTableRows(newListItem)); 
    }

    getBlankRow = (updatedListDetails: NewListItem[]) => {
        const lastRow: NewListItem = updatedListDetails.slice(-1).pop();
        let newListDetails: NewListItem[] = [...updatedListDetails];
        let lastRowKey: string = this.state.lastRowKey;
        let newDetailKey: number = this.state.newDetailKey;

        if (lastRow.amount && lastRow.ingredient && lastRow.unit) {
            const newRow: NewListItem = {
                uniqueKey: 'new' + String(this.state.newDetailKey),
                ingredient: '',
                amount: 0,
                unit: '',
            };

            newListDetails = [...newListDetails, newRow];
            lastRowKey = 'new' + String(this.state.newDetailKey);
            newDetailKey = this.state.newDetailKey + 1;
        }

        this.setState({
            newListDetails,
            lastRowKey,
            newDetailKey,
        });
    }

    handleRemoveNew = (removedNewListDetail: string) => {
        this.setState({
            newListDetails: [...this.state.newListDetails
                .filter((newListDetail: NewListItem) => newListDetail.uniqueKey !== removedNewListDetail)],
        });
    }

    editNewItemQuantity = (uniqueKey: string, newValue: string) => {
        let newListDetails: NewListItem[] = JSON.parse(JSON.stringify(this.state.newListDetails));
        newListDetails = [...newListDetails
            .map((newListDetail: NewListItem) => { 
                return newListDetail.uniqueKey === uniqueKey 
                    ? 
                    { ...newListDetail, 
                        amount: Number(newValue), 
                    }
                    : newListDetail;
            })],
        this.getBlankRow(newListDetails);
    }

    editNewItemUnit = (uniqueKey: string, newValue: string) => {
        let newListDetails: NewListItem[] = JSON.parse(JSON.stringify(this.state.newListDetails));
        newListDetails = [...newListDetails
            .map((newListDetail: NewListItem) => { 
                return newListDetail.uniqueKey === uniqueKey 
                    ?
                    { ...newListDetail, 
                        unit: newValue ,
                    }
                    : newListDetail;
            })],

        this.getBlankRow(newListDetails);
    }

    editNewItemIngredient = (uniqueKey: string, newValue: string) => {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.name.toLowerCase() === newValue.toLowerCase());

        let newListDetails: NewListItem[] = JSON.parse(JSON.stringify(this.state.newListDetails));
        newListDetails = [...newListDetails
            .map((newListDetail: NewListItem) => { 
                return newListDetail.uniqueKey === uniqueKey 
                    ?   
                    { ...newListDetail, 
                        ingredient: newValue, 
                        unit: existingIngredient ? existingIngredient.units : newListDetail.unit, 
                    }
                    : newListDetail;
            })],

        this.getBlankRow(newListDetails);
    }

    createNewTableRows(newListDetail: NewListItem) {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.name.toLowerCase() === newListDetail.ingredient.toLowerCase());
        return (
            <TableRow key={newListDetail.uniqueKey}>
                <TableRowColumn>
                    {newListDetail.uniqueKey !== this.state.lastRowKey
                        ?   (<IconButton 
                                tooltip="Remove Item" 
                                onClick={() => this.handleRemoveNew(newListDetail.uniqueKey)}
                            >
                                <Delete/>
                            </IconButton>)
                        :null
                    }
                </TableRowColumn>
                <TableRowColumn>
                    <AutoComplete
                        hintText="Ingredient"
                        maxSearchResults={5}
                        dataSource={this.state.ingredientList}
                        searchText={newListDetail.ingredient}
                        onUpdateInput={(searchText, dataSource) => this.editNewItemIngredient(newListDetail.uniqueKey, searchText)}
                        errorText={(!newListDetail.ingredient  && newListDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a unit' 
                            : null}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={newListDetail.amount}
                        hintText="Quantity"
                        errorText={(!newListDetail.amount && newListDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a quantity' 
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemQuantity(newListDetail.uniqueKey, newValue)}
                        type="number"
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={newListDetail.unit}
                        disabled={existingIngredient ? true : false}
                        hintText="Units"
                        errorText={(!newListDetail.unit && newListDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a unit' 
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemUnit(newListDetail.uniqueKey, newValue)}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    getExistingTableRows() {
        return this.state.updatedListDetails
            .map((listDetail: ListDetail) => this.createExistingTableRows(listDetail)); 
    }

    createExistingTableRows(listDetail: ListDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === listDetail.ingredientid);
        return (
            <TableRow key={listDetail.listitemid}>
                <TableRowColumn>
                    <IconButton 
                        tooltip="Remove Item" 
                        onClick={() => this.handleDelete(listDetail)}
                    >
                        <Delete/>
                    </IconButton> 
                </TableRowColumn>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={listDetail.amount}
                        hintText="Quantity"
                        errorText={!listDetail.amount ? 'Please set a quantity' : null}
                        onChange={(event: object, newValue: string) => this.editExistingItemQuantity(listDetail.listitemid, newValue)}
                        type="number"
                    />
                </TableRowColumn>
                <TableRowColumn>{ingredient.units}</TableRowColumn>
            </TableRow>
        );
    }

    handleDelete = (removedListDetail: ListDetail) => {
        this.setState({
            updatedListDetails: [...this.state.updatedListDetails
                .filter((listDetail: ListDetail) => listDetail.listitemid !== removedListDetail.listitemid)],
            deletedListDetails: [...this.state.deletedListDetails, removedListDetail],
        });
    }

    editExistingItemQuantity = (listitemid: number, newValue: string) => {
        this.setState({
            updatedListDetails: [...this.state.updatedListDetails
                .map((listDetail: ListDetail) => { 
                    return listDetail.listitemid === listitemid 
                    ? { ...listDetail, amount: Number(newValue) }
                    : listDetail;
                },
            )],
        });
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn></TableHeaderColumn>
                    <TableHeaderColumn>Item</TableHeaderColumn>
                    <TableHeaderColumn>Quantity</TableHeaderColumn>
                    <TableHeaderColumn>Units</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }
    
    createTable() {
        return (
            <div>
                <Table>
                    {this.createTableHeader()}
                    <TableBody 
                        stripedRows={true} 
                        showRowHover={true} 
                        displayRowCheckbox={false}
                    >
                        {this.getExistingTableRows()}
                        {this.getNewTableRows()}
                    </TableBody>
                </Table>
            </div>
        );
    }

    saveList = () => {
        const invalidExistingItem: ListDetail = this.state.updatedListDetails
            .find((listDetail: ListDetail) => !listDetail.amount);
        const newItems: NewListItem[] = this.state.newListDetails
            .filter((listDetail: NewListItem) => listDetail.uniqueKey !== this.state.lastRowKey);
        const invalidNewItem: NewListItem = newItems
            .find((listDetail: NewListItem) => !listDetail.ingredient || !listDetail.amount || !listDetail.unit);

        const newIngredients: NewIngredient[] = newItems
            .filter((newListDetail: NewListItem) => this.state.ingredientList.indexOf(newListDetail.ingredient) === -1)
            .map((newListDetail: NewListItem) => {
                return {
                    name: newListDetail.ingredient,
                    units: newListDetail.unit,
                };
            });

        const url: string = '/List/Detail/' + String(this.state.listid);
        
        if (!invalidExistingItem && !invalidNewItem) {
            this.props.dispatch(postBulkIngredients(newIngredients))
                .then((reponse: Ingredient[]) => {
                    const fullIngredients: Ingredient[] = [...this.props.ingredients, ...reponse];

                    const newListDetail: NewListDetail[] = newItems
                    .map((newListItem: NewListItem) => {
                        const newIngredient: Ingredient = fullIngredients
                            .find((ingredients: Ingredient) => ingredients.name.toLowerCase() === newListItem.ingredient.toLowerCase());
                        return {
                            listid: this.state.listid, 
                            ingredientid: newIngredient.ingredientid,
                            amount: newListItem.amount,
                        };
                    });
                    
                    this.props.dispatch(postBulkListDetails(newListDetail));
                    this.props.dispatch(deletetBulkListDetails(this.state.deletedListDetails));
                    this.props.dispatch(putBulkListDetails(this.state.updatedListDetails));
                    this.props.history.push(url);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    }

    render() {
        return (
            <div>
                <br/>
                <FlatButton
                    label="Save"
                    primary={true}
                    onClick={this.state.listid ? this.saveList : undefined}
                />
                <br/>
                {(this.state && this.state.listid && this.state.updatedListDetails && this.props.ingredients)
                ? this.createTable()
                : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        listDetails: store.listDetailReducer.listDetails,
        ingredients: store.ingredientReducer.ingredients,
    };
};
  
const ConnectedListEdit = connect(mapStateToProps)(ListEdit);
export default ConnectedListEdit;
