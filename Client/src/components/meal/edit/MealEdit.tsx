import * as React from 'react';

import { connect } from 'react-redux';

import { AppLoading, AppUpdating } from '../../loadingHandler';
import { NotFound404 } from '../../errorHandler';

import textHelper from '../../../helpers/textHelper';
import validationHelper from '../../../helpers/validationHelper';

import { MealDetail, NewMealItem, NewMealDetail, MealEditProps, MealEditState } from '../../../interfaces/mealDetailInterfaces';
import { Meal } from '../../../interfaces/mealInterfaces';
import { Ingredient, NewIngredient } from '../../../interfaces/ingredientInterfaces';
import { AppStore } from '../../../interfaces/stateInterfaces';

import { getMealDetails, updateMeal } from '../../../actions/mealDetails/mealDetailActions';
import { getMeals } from '../../../actions/meals/mealActions';
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

class MealEdit extends React.Component<MealEditProps, MealEditState> {
    constructor(props: any) {
        super();

        this.state = {
            mealid: undefined,
            filterdMeal: undefined,
            filterdMealDetails: [],
            updatedMealDetails: [],
            deletedMealDetails: [],
            ingredientList: [],
            newMealDetails: [{
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
        this.props.dispatch(getMealDetails());
        this.props.dispatch(getMeals());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: MealEditProps) {
        const mealid: number =  Number(nextProps.match.params.mealid);
        const filterdMeal: Meal = nextProps.meals 
        ? nextProps.meals.find((meal: Meal) => meal.mealid === mealid) 
        : undefined; 
        const filterdMealDetails: MealDetail[] = nextProps.mealDetails 
            ? nextProps.mealDetails.filter((mealDetail: MealDetail) => mealDetail.mealid === mealid) 
            : []; 
        const updatedMealDetails: MealDetail[] = (this.state && this.state.updatedMealDetails.length !== 0)
            ? this.state.updatedMealDetails
            : [...filterdMealDetails];
        const ingredientList = nextProps.ingredients 
            ? [...new Set<string>(nextProps.ingredients.map((ingredient: Ingredient) => textHelper.toTitleCase(ingredient.name)))]
            : []; 

        this.setState({
            mealid,
            filterdMeal,
            filterdMealDetails, 
            updatedMealDetails,
            ingredientList,
        });
    }

    getMealEdit = () => {
        return (
            this.state.filterdMeal ? this.getTable() : <NotFound404/>
        );
    }

    getTable = () => {
        return (
            <div>
                {this.props.updating 
                    ?  (<div>
                            <AppUpdating/>
                            <h2 style={styles.editHeading}>{this.state.filterdMeal.category}</h2>
                        </div>)
                    :  (<div>
                            <FlatButton label="Save" primary={true} onClick={this.saveMeal}/>
                            <FlatButton label="Cancel" secondary={true} onClick={this.cancelEdit}/>
                            <h2 style={styles.editHeading}>{this.state.filterdMeal.name}</h2>
                        </div>)
                }
                <br/>
                {this.createTable()}
            </div>
        );
    }

    saveMeal = () => {
        const url: string = '/Meal/Detail/' + String(this.state.mealid);
        const newItems: NewMealItem[] = this.state.newMealDetails
        .filter((mealDetail: NewMealItem) => mealDetail.uniqueKey !== this.state.lastRowKey);
        const newIngredients: NewIngredient[] = newItems
            .filter((newMealDetail: NewMealItem) => this.state.ingredientList.indexOf(newMealDetail.ingredient) === -1)
            .map((newMealDetail: NewMealItem) => {
                return {
                    name: newMealDetail.ingredient,
                    units: newMealDetail.unit,
                };
            });

        if (this.validateMeal(newItems, this.state.updatedMealDetails)) {
            this.props.dispatch(postBulkIngredients(newIngredients))
                .then((reponse: Ingredient[]) => {
                    const fullIngredients: Ingredient[] = [...this.props.ingredients, ...reponse];
                    const newMealDetail: NewMealDetail[] = newItems
                    .map((newMealItem: NewMealItem) => {
                        const newIngredient: Ingredient = fullIngredients
                            .find((ingredients: Ingredient) => 
                                textHelper.toTitleCase(ingredients.name) === textHelper.toTitleCase(newMealItem.ingredient));
                        return {
                            mealid: this.state.mealid, 
                            ingredientid: newIngredient.ingredientid,
                            amount: newMealItem.amount,
                        };
                    });

                    this.props.dispatch(updateMeal(newMealDetail, this.state.deletedMealDetails, this.state.updatedMealDetails))
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

    validateMeal = (newItems: NewMealItem[], updatedItems: MealDetail[]) => {
        const invalidExistingItem: MealDetail = this.state.updatedMealDetails
            .find((mealDetail: MealDetail) => validationHelper.validateIngredientAmount(mealDetail.amount) ? true : false);
        const invalidNewItem: NewMealItem = newItems
            .find((mealDetail: NewMealItem) => {
                return (validationHelper.validateIngredientAmount(mealDetail.amount) 
                        || validationHelper.validateIngredientName(mealDetail.ingredient) 
                        || validationHelper.validateIngredientUnit(mealDetail.unit)) 
                    ? true 
                    : false;
            });
        
        const isValid: boolean = (!invalidExistingItem && ! invalidNewItem) ? true : false;

        return isValid;
    }

    cancelEdit = () => {
        const url: string = '/Meal/Detail/' + String(this.state.mealid);
        this.props.history.push(url);
    }

    createTable() {
        return (
            <div>
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
        return this.state.updatedMealDetails
            .map((mealDetail: MealDetail) => this.createExistingTableRows(mealDetail)); 
    }

    createExistingTableRows(mealDetail: MealDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === mealDetail.ingredientid);

        return (
            <TableRow key={mealDetail.mealingredientid}>
                <TableRowColumn>
                    <IconButton tooltip="Remove Item" onClick={() => this.handleDelete(mealDetail)}>
                        <Delete/>
                    </IconButton> 
                </TableRowColumn>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={mealDetail.amount}
                        hintText="Quantity"
                        errorText={validationHelper.validateIngredientAmount(mealDetail.amount)}
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

    getNewTableRows = () => {
        return this.state.newMealDetails
            .map((newMealItem: NewMealItem) => this.createNewTableRows(newMealItem)); 
    }

    createNewTableRows(newMealDetail: NewMealItem) {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => textHelper.toTitleCase(ingredient.name) === textHelper.toTitleCase(newMealDetail.ingredient));

        return (
            <TableRow key={newMealDetail.uniqueKey}>
                <TableRowColumn>
                    {newMealDetail.uniqueKey !== this.state.lastRowKey
                        ?   (<IconButton tooltip="Remove Item" onClick={() => this.handleRemoveNew(newMealDetail.uniqueKey)}>
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
                        errorText={newMealDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientName(newMealDetail.ingredient)
                            : null}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={newMealDetail.amount}
                        hintText="Quantity"
                        errorText={newMealDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientAmount(newMealDetail.amount)
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
                        errorText={newMealDetail.uniqueKey !== this.state.lastRowKey 
                            ? validationHelper.validateIngredientUnit(newMealDetail.unit)
                            : null}
                        onChange={(event: object, newValue: string) => this.editNewItemUnit(newMealDetail.uniqueKey, newValue)}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    handleRemoveNew = (removedNewMealDetail: string) => {
        this.setState({
            newMealDetails: [...this.state.newMealDetails
                .filter((newMealDetail: NewMealItem) => newMealDetail.uniqueKey !== removedNewMealDetail)],
        });
    }

    editNewItemIngredient = (uniqueKey: string, newValue: string) => {
        const existingIngredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => textHelper.toTitleCase(ingredient.name) === textHelper.toTitleCase(newValue));
        let newMealDetails: NewMealItem[] = JSON.parse(JSON.stringify(this.state.newMealDetails));

        newMealDetails = [...newMealDetails
            .map((newMealDetail: NewMealItem) => { 
                return newMealDetail.uniqueKey === uniqueKey 
                    ?   
                    { ...newMealDetail, 
                        ingredient: textHelper.toTitleCase(newValue), 
                        unit: existingIngredient ? existingIngredient.units : newMealDetail.unit, 
                    }
                    : newMealDetail;
            })],

        this.getBlankRow(newMealDetails);
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

    render() {
        return (
            <div>
                {(!this.props.loading && this.state && this.state.mealid 
                    && this.state.updatedMealDetails && this.props.ingredients) 
                    ? this.getMealEdit() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        mealDetails: store.mealDetailReducer.mealDetails,
        meals: store.mealReducer.meals,
        ingredients: store.ingredientReducer.ingredients,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: (store.appReducer.posting > 0 || store.appReducer.putting > 0 || store.appReducer.deleting > 0) ? true : false,
    };
};
  
const ConnectedMealEdit = connect(mapStateToProps)(MealEdit);
export default ConnectedMealEdit;
