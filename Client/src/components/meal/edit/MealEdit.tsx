import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { 
    MealDetail, 
    NewMealItem,
    NewMealDetail, 
} from '../../../interfaces/mealDetailInterfaces';
import { 
    Ingredient,
    NewIngredient, 
} from '../../../interfaces/ingredientInterfaces';

import { 
    getMealDetails,
    deletetBulkMealDetails,
    putBulkMealDetails, 
    postBulkMealDetails,
} from '../../../actions/mealDetails/mealDetailActions';

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

interface MealEditProps {
    mealDetails: MealDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

interface MealEditState {
    filterdMealDetails: MealDetail[];
    updatedMealDetails: MealDetail[];
    deletedMealDetails: MealDetail[];
    newMealDetails: NewMealItem[];
    mealid: number;
    newDetailKey: number;
    ingredientList: string[];
    lastRowKey: string;
}

class MealEdit extends React.Component<MealEditProps, MealEditState> {
    constructor(props: any) {
        super();

        this.state = {
            filterdMealDetails: [],
            updatedMealDetails: [],
            deletedMealDetails: [],
            mealid: undefined,
            newMealDetails: [{
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
        this.props.dispatch(getMealDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: MealEditProps) {
        const mealid: number =  Number(nextProps.match.params.mealid);
        const filterdMealDetails: MealDetail[] = nextProps.mealDetails 
            ? nextProps.mealDetails.filter((mealDetail: MealDetail) => mealDetail.mealid === mealid) 
            : []; 
        const updatedMealDetails: MealDetail[] = (this.state && this.state.updatedMealDetails.length !== 0)
            ? this.state.updatedMealDetails
            : [...filterdMealDetails];
        const ingredientList = nextProps.ingredients 
            ? [...new Set<string>(nextProps.ingredients.map((ingredient: Ingredient) => ingredient.name.toLowerCase()))]
            : []; 

        this.setState({
            mealid,
            filterdMealDetails, 
            updatedMealDetails,
            ingredientList,
        });
    }

    getNewTableRows = () => {
        return this.state.newMealDetails
            .map((newMealItem: NewMealItem) => this.createNewTableRows(newMealItem)); 
    }

    getBlankRow = (updatedMealDetails: NewMealItem[]) => {
        const lastRow: NewMealItem = updatedMealDetails.slice(-1).pop();
        let newMealDetails: NewMealItem[] = [...updatedMealDetails];
        let lastRowKey: string = this.state.lastRowKey;
        let newDetailKey: number = this.state.newDetailKey;

        if (lastRow.amount && lastRow.ingredient && lastRow.unit) {
            const newRow: NewMealItem = {
                uniqueKey: 'new' + String(this.state.newDetailKey),
                ingredient: '',
                amount: 0,
                unit: '',
            };

            newMealDetails = [...newMealDetails, newRow];
            lastRowKey = 'new' + String(this.state.newDetailKey);
            newDetailKey = this.state.newDetailKey + 1;
        }

        this.setState({
            newMealDetails,
            lastRowKey,
            newDetailKey,
        });
    }

    handleRemoveNew = (removedNewMealDetail: string) => {
        this.setState({
            newMealDetails: [...this.state.newMealDetails
                .filter((newMealDetail: NewMealItem) => newMealDetail.uniqueKey !== removedNewMealDetail)],
        });
    }

    editNewItemQuantity = (uniqueKey: string, newValue: string) => {
        let newMealDetails: NewMealItem[] = JSON.parse(JSON.stringify(this.state.newMealDetails));
        newMealDetails = [...newMealDetails
            .map((newMealDetail: NewMealItem) => { 
                return newMealDetail.uniqueKey === uniqueKey 
                    ? 
                    { ...newMealDetail, 
                        amount: Number(newValue), 
                    }
                    : newMealDetail;
            })],
        this.getBlankRow(newMealDetails);
    }

    editNewItemUnit = (uniqueKey: string, newValue: string) => {
        let newMealDetails: NewMealItem[] = JSON.parse(JSON.stringify(this.state.newMealDetails));
        newMealDetails = [...newMealDetails
            .map((newMealDetail: NewMealItem) => { 
                return newMealDetail.uniqueKey === uniqueKey 
                    ?
                    { ...newMealDetail, 
                        unit: newValue ,
                    }
                    : newMealDetail;
            })],

        this.getBlankRow(newMealDetails);
    }

    editNewItemIngredient = (uniqueKey: string, newValue: string) => {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.name.toLowerCase() === newValue.toLowerCase());

        let newMealDetails: NewMealItem[] = JSON.parse(JSON.stringify(this.state.newMealDetails));
        newMealDetails = [...newMealDetails
            .map((newMealDetail: NewMealItem) => { 
                return newMealDetail.uniqueKey === uniqueKey 
                    ?   
                    { ...newMealDetail, 
                        ingredient: newValue, 
                        unit: existingIngredient ? existingIngredient.units : newMealDetail.unit, 
                    }
                    : newMealDetail;
            })],

        this.getBlankRow(newMealDetails);
    }

    createNewTableRows(newMealDetail: NewMealItem) {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.name.toLowerCase() === newMealDetail.ingredient.toLowerCase());
        return (
            <TableRow key={newMealDetail.uniqueKey}>
                <TableRowColumn>
                    {newMealDetail.uniqueKey !== this.state.lastRowKey
                        ?   (<IconButton 
                                tooltip="Remove Item" 
                                onClick={() => this.handleRemoveNew(newMealDetail.uniqueKey)}
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
                        searchText={newMealDetail.ingredient}
                        onUpdateInput={(searchText, dataSource) => this.editNewItemIngredient(newMealDetail.uniqueKey, searchText)}
                        errorText={(!newMealDetail.ingredient  && newMealDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a unit' 
                            : null}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={newMealDetail.amount}
                        hintText="Quantity"
                        errorText={(!newMealDetail.amount && newMealDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a quantity' 
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemQuantity(newMealDetail.uniqueKey, newValue)}
                        type="number"
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={newMealDetail.unit}
                        disabled={existingIngredient ? true : false}
                        hintText="Units"
                        errorText={(!newMealDetail.unit && newMealDetail.uniqueKey !== this.state.lastRowKey) 
                            ? 'Please set a unit' 
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemUnit(newMealDetail.uniqueKey, newValue)}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    getExistingTableRows() {
        return this.state.updatedMealDetails
            .map((mealDetail: MealDetail) => this.createExistingTableRows(mealDetail)); 
    }

    createExistingTableRows(mealDetail: MealDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === mealDetail.ingredientid);
        return (
            <TableRow key={mealDetail.mealingredientid}>
                <TableRowColumn>
                    <IconButton 
                        tooltip="Remove Item" 
                        onClick={() => this.handleDelete(mealDetail)}
                    >
                        <Delete/>
                    </IconButton> 
                </TableRowColumn>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={mealDetail.amount}
                        hintText="Quantity"
                        errorText={!mealDetail.amount ? 'Please set a quantity' : null}
                        onChange={(event: object, newValue: string) => this.editExistingItemQuantity(mealDetail.mealingredientid, newValue)}
                        type="number"
                    />
                </TableRowColumn>
                <TableRowColumn>{ingredient.units}</TableRowColumn>
            </TableRow>
        );
    }

    handleDelete = (removedMealDetail: MealDetail) => {
        this.setState({
            updatedMealDetails: [...this.state.updatedMealDetails
                .filter((mealDetail: MealDetail) => mealDetail.mealingredientid !== removedMealDetail.mealingredientid)],
            deletedMealDetails: [...this.state.deletedMealDetails, removedMealDetail],
        });
    }

    editExistingItemQuantity = (mealingredientid: number, newValue: string) => {
        this.setState({
            updatedMealDetails: [...this.state.updatedMealDetails
                .map((mealDetail: MealDetail) => { 
                    return mealDetail.mealingredientid === mealingredientid 
                    ? { ...mealDetail, amount: Number(newValue) }
                    : mealDetail;
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

    saveMeal = () => {
        const invalidExistingItem: MealDetail = this.state.updatedMealDetails
            .find((mealDetail: MealDetail) => !mealDetail.amount);
        const newItems: NewMealItem[] = this.state.newMealDetails
            .filter((mealDetail: NewMealItem) => mealDetail.uniqueKey !== this.state.lastRowKey);
        const invalidNewItem: NewMealItem = newItems
            .find((mealDetail: NewMealItem) => !mealDetail.ingredient || !mealDetail.amount || !mealDetail.unit);

        const newIngredients: NewIngredient[] = newItems
            .filter((newMealDetail: NewMealItem) => this.state.ingredientList.indexOf(newMealDetail.ingredient) === -1)
            .map((newMealDetail: NewMealItem) => {
                return {
                    name: newMealDetail.ingredient,
                    units: newMealDetail.unit,
                };
            });

        const url: string = '/Meal/Detail/' + String(this.state.mealid);

        if (!invalidExistingItem && !invalidNewItem) {
            this.props.dispatch(postBulkIngredients(newIngredients))
                .then((reponse: Ingredient[]) => {
                    const fullIngredients: Ingredient[] = [...this.props.ingredients, ...reponse];

                    const newMealDetail: NewMealDetail[] = newItems
                    .map((newMealItem: NewMealItem) => {
                        const newIngredient: Ingredient = fullIngredients
                            .find((ingredients: Ingredient) => ingredients.name.toLowerCase() === newMealItem.ingredient.toLowerCase());
                        return {
                            mealid: this.state.mealid, 
                            ingredientid: newIngredient.ingredientid,
                            amount: newMealItem.amount,
                        };
                    });

                    this.props.dispatch(postBulkMealDetails(newMealDetail));
                    this.props.dispatch(deletetBulkMealDetails(this.state.deletedMealDetails));
                    this.props.dispatch(putBulkMealDetails(this.state.updatedMealDetails));
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
                    onClick={this.state.mealid ? this.saveMeal : undefined}
                />
                <br/>
                {(this.state && this.state.mealid && this.state.updatedMealDetails && this.props.ingredients)
                ? this.createTable()
                : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        mealDetails: store.mealDetailReducer.mealDetails,
        ingredients: store.ingredientReducer.ingredients,
    };
};
  
const ConnectedMealEdit = connect(mapStateToProps)(MealEdit);
export default ConnectedMealEdit;
