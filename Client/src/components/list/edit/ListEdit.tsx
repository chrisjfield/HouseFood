import * as React from 'react';

import { connect } from 'react-redux';

import { AppLoading, AppUpdating } from '../../loadingHandler';
import { NotFound404 } from '../../errorHandler';

import textHelper from '../../../helpers/textHelper';
import validationHelper from '../../../helpers/validationHelper';

import { ListDetail, NewListItem, NewListDetail, ListEditProps, ListEditState } from '../../../interfaces/listDetailInterfaces';
import { List } from '../../../interfaces/listInterfaces';
import { Ingredient, NewIngredient } from '../../../interfaces/ingredientInterfaces';
import { AppStore } from '../../../interfaces/stateInterfaces';

import { getListDetails, updateList } from '../../../actions/listDetail/listDetailActions';
import { getLists } from '../../../actions/lists/listActions';
import { getIngredients, postBulkIngredients } from '../../../actions/ingredient/ingredientActions';

import {
    Table, TableBody, TableHeader,
    TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Delete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';

import styles from '../../../styles';

class ListEdit extends React.Component<ListEditProps, ListEditState> {
    constructor(props: any) {
        super();

        this.state = {
            listid: undefined,
            filterdList: undefined,
            filterdListDetails: [],
            updatedListDetails: [],
            deletedListDetails: [],
            ingredientList: [],
            newListDetails: [{
                uniqueKey: 'new1',
                ingredient: '',
                amount: 0,
                unit: '',
            }],
            newDetailKey: 2,
            lastRowKey: 'new1',
        };
    }

    componentWillMount() {
        this.props.dispatch(getListDetails());
        this.props.dispatch(getLists());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: ListEditProps) {
        const listid: number =  Number(nextProps.match.params.listid);
        const filterdList: List = nextProps.lists 
            ? nextProps.lists.find((list: List) => list.listid === listid) 
            : undefined; 
        const filterdListDetails: ListDetail[] = nextProps.listDetails 
            ? nextProps.listDetails.filter((listDetail: ListDetail) => listDetail.listid === listid) 
            : []; 
        const updatedListDetails: ListDetail[] = (this.state && this.state.updatedListDetails.length !== 0)
            ? this.state.updatedListDetails
            : [...filterdListDetails];
        const ingredientList = textHelper.getArrayFromProperty(nextProps.ingredients, 'name');

        this.setState({
            listid,
            filterdList,
            filterdListDetails, 
            updatedListDetails,
            ingredientList,
        });
    }

    getListEdit = () => {
        return (
            this.state.filterdList ? this.getTable() : <NotFound404/>
        );
    }

    getTable = () => {
        return (
            <div>
                {this.props.updating 
                    ?  (<div>
                            <AppUpdating key="saving"/>
                            <h2 style={styles.editHeading}>{this.state.filterdList.name}</h2>
                        </div>)
                    :  (<div>
                            <FlatButton label="Save" primary={true} onClick={this.saveList}/>
                            <FlatButton label="Cancel" secondary={true} onClick={this.cancelEdit}/>
                            <h2 style={styles.editHeading}>{this.state.filterdList.name}</h2>
                        </div>)
                }
                <br/>
                {this.createTable()}
            </div>
        );
    }

    saveList = () => {
        const url: string = '/List/Detail/' + String(this.state.listid);
        const newItems: NewListItem[] = this.state.newListDetails
            .filter((listDetail: NewListItem) => listDetail.uniqueKey !== this.state.lastRowKey);
        const newIngredients: NewIngredient[] = newItems
            .filter((newListDetail: NewListItem) => this.state.ingredientList.indexOf(newListDetail.ingredient) === -1)
            .map((newListDetail: NewListItem) => {
                return {
                    name: newListDetail.ingredient,
                    units: newListDetail.unit,
                };
            });

        if (this.validateList(newItems, this.state.updatedListDetails)) {
            this.props.dispatch(postBulkIngredients(newIngredients))
                .then((reponse: Ingredient[]) => {
                    const fullIngredients: Ingredient[] = [...this.props.ingredients, ...reponse];
                    const newListDetail: NewListDetail[] = newItems
                    .map((newListItem: NewListItem) => {
                        const newIngredient: Ingredient = fullIngredients
                            .find((ingredients: Ingredient) => 
                                textHelper.toTitleCase(ingredients.name) === textHelper.toTitleCase(newListItem.ingredient));
                        return {
                            listid: this.state.listid, 
                            ingredientid: newIngredient.ingredientid,
                            amount: newListItem.amount,
                        };
                    });
                    
                    this.props.dispatch(updateList(newListDetail, this.state.deletedListDetails, this.state.updatedListDetails))
                        .then(() => this.props.history.push(url))
                        .catch((error: any) => {
                            throw error;
                        });
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    }

    validateList = (newItems: NewListItem[], updatedItems: ListDetail[]) => {
        const invalidExistingItem: ListDetail = updatedItems
            .find((listDetail: ListDetail) => validationHelper.validateIngredientAmount(listDetail.amount) ? true : false);
        const invalidNewItem: NewListItem = newItems
            .find((listDetail: NewListItem) => {
                return (validationHelper.validateIngredientAmount(listDetail.amount) 
                        || validationHelper.validateIngredientName(listDetail.ingredient) 
                        || validationHelper.validateIngredientUnit(listDetail.unit)) 
                    ? true 
                    : false;
            });
        
        const isValid: boolean = (!invalidExistingItem && ! invalidNewItem) ? true : false;

        return isValid;
    }

    cancelEdit = () => {
        const url: string = '/List/Detail/' + String(this.state.listid);
        this.props.history.push(url);
    }

    createTable() {
        return (
            <div style={styles.table}>
                <Table>
                    {this.createTableHeader()}
                    <TableBody stripedRows={false} showRowHover={false} displayRowCheckbox={false}>
                        {this.getExistingTableRows()}
                        {this.getNewTableRows()}
                    </TableBody>
                </Table>
            </div>
        );
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn></TableHeaderColumn>
                    <TableHeaderColumn style={styles.columnHeadings}>Item</TableHeaderColumn>
                    <TableHeaderColumn style={styles.columnHeadings}>Quantity</TableHeaderColumn>
                    <TableHeaderColumn style={styles.columnHeadings}>Units</TableHeaderColumn>
                </TableRow>
            </TableHeader>
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
                    <IconButton tooltip="Remove Item" onClick={() => this.handleDelete(listDetail)}>
                        <Delete/>
                    </IconButton> 
                </TableRowColumn>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={listDetail.amount}
                        hintText="Quantity"
                        errorText={validationHelper.validateIngredientAmount(listDetail.amount)}
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

    getNewTableRows = () => {
        return this.state.newListDetails
            .map((newListItem: NewListItem) => this.createNewTableRows(newListItem)); 
    }

    createNewTableRows(newListDetail: NewListItem) {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => textHelper.toTitleCase(ingredient.name) === textHelper.toTitleCase(newListDetail.ingredient));
        
        return (
            <TableRow key={newListDetail.uniqueKey}>
                <TableRowColumn>
                    {newListDetail.uniqueKey !== this.state.lastRowKey
                        ? (<IconButton  tooltip="Remove Item" onClick={() => this.handleRemoveNew(newListDetail.uniqueKey)}>
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
                        errorText={newListDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientName(newListDetail.ingredient)
                            : null}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={newListDetail.amount}
                        hintText="Quantity"
                        errorText={newListDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientAmount(newListDetail.amount)
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
                        errorText={newListDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientUnit(newListDetail.unit)
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemUnit(newListDetail.uniqueKey, newValue)}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    handleRemoveNew = (removedNewListDetail: string) => {
        this.setState({
            newListDetails: [...this.state.newListDetails
                .filter((newListDetail: NewListItem) => newListDetail.uniqueKey !== removedNewListDetail)],
        });
    }

    editNewItemIngredient = (uniqueKey: string, newValue: string) => {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => textHelper.toTitleCase(ingredient.name) === textHelper.toTitleCase(newValue));
        let newListDetails: NewListItem[] = JSON.parse(JSON.stringify(this.state.newListDetails));

        newListDetails = [...newListDetails
            .map((newListDetail: NewListItem) => { 
                return newListDetail.uniqueKey === uniqueKey 
                    ?   
                    { ...newListDetail, 
                        ingredient: textHelper.toTitleCase(newValue), 
                        unit: existingIngredient ? existingIngredient.units : newListDetail.unit, 
                    }
                    : newListDetail;
            })],

        this.getBlankRow(newListDetails);
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
                        unit: newValue,
                    }
                    : newListDetail;
            })],

        this.getBlankRow(newListDetails);
    }

    render() {
        return (
            <div>
                {(!this.props.loading && this.state && this.state.listid 
                  && this.state.updatedListDetails && this.props.ingredients) 
                    ? this.getListEdit() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        listDetails: store.listDetailReducer.listDetails,
        lists: store.listReducer.lists,
        ingredients: store.ingredientReducer.ingredients,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: (store.appReducer.posting > 0 || store.appReducer.putting > 0 || store.appReducer.deleting > 0) ? true : false,
    };
};
  
const ConnectedListEdit = connect(mapStateToProps)(ListEdit);
export default ConnectedListEdit;
