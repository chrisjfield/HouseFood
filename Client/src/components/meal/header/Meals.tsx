import * as React from 'react';

import { connect } from 'react-redux';

import history from '../../../history';
import { AppLoading, AppUpdating } from '../../loadingHandler';

import textHelper from '../../../helpers/textHelper';
import validationHelper from '../../../helpers/validationHelper';

import { Meal, NewMeal, MealsProps, MealsState } from '../../../interfaces/mealInterfaces';
import { AppStore } from '../../../interfaces/stateInterfaces';

import { getMeals, saveMeal, editMeal } from '../../../actions/meals/mealActions';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import View from 'material-ui/svg-icons/action/visibility';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import styles from '../../../styles';

class Meals extends React.Component<MealsProps, MealsState> {
    constructor(props: any) {
        super();

        this.state = {
            categories: [],
            searchTerms: [],
            searchString: '',
            newMealDialogOpen: false,
            newMeal: undefined,
            editMealDialogOpen: false,
            mealEditing: undefined,
            nameErrorText: undefined,
            categoryErrorText: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getMeals());
    }
 
    componentWillReceiveProps(nextProps: MealsProps) {
        const categories = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => textHelper.toTitleCase(meal.category)))]
            : []; 
        const mealNames = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => textHelper.toTitleCase(meal.name)))]
            : []; 

        this.setState({
            searchTerms: [...categories, ...mealNames],
            categories: categories.sort(),
        });
    }

    getMeals() {
        return (
            <div>
                <br/>
                <FlatButton label="Add Meal" primary={true} onClick={this.openNewMealDialog}/>
                {this.state.newMeal ? this.getNewMealDialog() : null}
                {this.state.mealEditing ? this.getEditMealDialog() : null}
                {this.createSearch()}
                {this.state.categories.map((category: string) => this.createLists(category))}
            </div>
        );
    }

    openNewMealDialog = () => {
        this.setState({
            newMealDialogOpen: true,
            newMeal: {
                name: '',
                category: '',
            },
        });
    }

    getNewMealDialog = () => {
        const actions: JSX.Element[] = [
            <FlatButton key="add" type="submit" label="Add" />,
            <FlatButton key="cancel" label="Cancel" primary={true} onClick={this.handleDialogClose}/>,
        ];

        return (
            <div>
                <Dialog title="Create Meal" open={this.state.newMealDialogOpen} onRequestClose={this.handleDialogClose}>
                    <form onSubmit={this.handleSaveNewMeal}>
                        <TextField
                            hintText="Meal Name"
                            value={this.state.newMeal.name}
                            onChange={(event: object, newValue: string) => this.editNewName(newValue)}
                            errorText={this.state.nameErrorText}
                        />
                        <AutoComplete
                            hintText="Category"
                            maxSearchResults={5}
                            dataSource={this.state.categories}
                            onUpdateInput={(searchText: string) => this.editNewCategory(searchText)}
                            errorText={this.state.categoryErrorText}
                        />
                        {this.props.updating ? [<AppUpdating/>] : actions}
                    </form>
                </Dialog>
            </div>
        );
    }

    handleDialogClose = () => {
        this.setState({
            newMealDialogOpen: false,            
            editMealDialogOpen: false,
            mealEditing: undefined,
            nameErrorText: undefined,
            categoryErrorText: undefined,
        });
    }

    handleSaveNewMeal = (event: any) => {
        event.preventDefault();
        const newMeal: NewMeal = this.state.newMeal;

        if (!this.validateMealName(newMeal.name) && !this.validateMealCategory(newMeal.category)) {
            this.props.dispatch(saveMeal(newMeal))
            .then((response: Meal) => {
                const url: string = '/Meal/Edit/' + String(response.mealid);
                history.push(url);
            })
            .catch((error: any) => {
                console.log(error);
            });
        }
    }

    validateMealName = (name: string) => {
        const validationMessage: string = validationHelper.validateMealName(name);

        this.setState({ 
            nameErrorText: validationMessage,
        });

        return validationMessage;
    }

    validateMealCategory = (category: string) => {
        const validationMessage: string = validationHelper.validateMealCategory(category);
        
        this.setState({ 
            categoryErrorText: validationMessage,
        });

        return validationMessage;
    }

    editNewName = (newName: string) => {
        this.setState({ 
            newMeal: { ...this.state.newMeal, name: textHelper.toTitleCase(newName) }, 
        });
        this.validateMealName(newName);
    }

    editNewCategory = (newCategory: string) => {
        this.setState({ 
            newMeal: { ...this.state.newMeal, category: textHelper.toTitleCase(newCategory) },
        });
        this.validateMealCategory(newCategory);
    }

    getEditMealDialog = () => {
        const actions: JSX.Element[] = [
            <FlatButton key="add" type="submit" label="Save" />,
            <FlatButton key="cancel" label="Cancel" primary={true} onClick={this.handleDialogClose}/>,
        ];


        return (
            <div>
                <Dialog title="Edit Meal" open={this.state.editMealDialogOpen} onRequestClose={this.handleDialogClose}>
                    <form onSubmit={this.handleSaveEditedMeal}>
                        <TextField
                            hintText="Meal Name"
                            value={this.state.mealEditing.name}
                            onChange={(event: object, newValue: string) => this.editEditedName(newValue)}
                            errorText={this.state.nameErrorText}
                        />
                        <AutoComplete
                            hintText="Category"
                            maxSearchResults={5}
                            searchText={this.state.mealEditing.category}
                            dataSource={this.state.categories}
                            onUpdateInput={(searchText: string) => this.editEditedCategory(searchText)}
                            errorText={this.state.categoryErrorText}
                        />
                        {this.props.updating ? [<AppUpdating/>] : actions}
                    </form>
                </Dialog>
            </div>
        );        
    }

    handleSaveEditedMeal = (event: any) => {
        event.preventDefault();
        const editedMeal: Meal = this.state.mealEditing;

        if (!this.validateMealName(editedMeal.name) && !this.validateMealCategory(editedMeal.category)) {
            this.props.dispatch(editMeal(editedMeal))
            .then((response: Meal) => {
                this.handleDialogClose();
            })
            .catch((error: any) => {
                console.log(error);
            });
        }
    }

    editEditedName = (newName: string) => {
        this.setState({ 
            mealEditing: { ...this.state.mealEditing, name: textHelper.toTitleCase(newName) },
        });
        this.validateMealName(newName);
    }

    editEditedCategory = (newCategory: string) => {
        this.setState({ 
            mealEditing: { ...this.state.mealEditing, category: textHelper.toTitleCase(newCategory) }, 
        });
        this.validateMealCategory(newCategory);
    }

    createSearch = () => {
        return (
            <AutoComplete
                hintText="Search"
                maxSearchResults={5}
                searchText={this.state.searchString}
                dataSource={this.state.searchTerms}
                onUpdateInput={(searchText, dataSource) => this.applySearch(searchText)}
                fullWidth={true}
                style={styles.search}
            />
        );
    }

    applySearch = (search: string) => {
        this.setState({
            searchString: textHelper.toTitleCase(search),
        });
    }

    createLists = (category: string) => {
        const filteredMeals: Meal[] = this.props.meals
            .filter((meal: Meal) => {
                return meal.category === category 
                    && ((meal.name.includes(this.state.searchString) 
                            || meal.category.includes(this.state.searchString)) 
                        || !this.state.searchString);
            })
            .sort((a,b) => {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);});

        return (
            filteredMeals.length === 0 
                ? null 
                :  (<div key={category}>
                        <Subheader style={styles.columnHeadings}>{category}</Subheader>
                        <List> 
                            {filteredMeals.map((meal: Meal) => this.createListItem(meal))}
                        </List>
                        <Divider />
                    </div>)
        );
    }

    createListItem = (meal: Meal) => {   
        return ( 
            <div key={meal.mealid} >     
                <IconButton tooltip="View Details">
                    <View onClick={() => this.handleViewDetails(meal.mealid)}/>
                </IconButton>
                <IconButton tooltip="Edit">
                    <Edit onClick={() => this.handleEdit(meal.mealid)}/>
                </IconButton>  
                <div style={styles.mealNames}>
                    <ListItem primaryText={meal.name} onClick={() => this.handleViewDetails(meal.mealid)}/>
                </div>
            </div>
        );
    }

    handleViewDetails = (mealId: number) => {
        const url: string = '/Meal/Detail/' + String(mealId);
        this.props.history.push(url);
    }

    handleEdit = (mealid: number) => {
        this.setState({
            editMealDialogOpen: true,
            mealEditing: this.props.meals.find((meal: Meal) => meal.mealid === mealid),
        });
    }    

    render() {
        return (
            <div>
                {(!this.props.loading && this.props.meals && this.state
                    && this.state.searchTerms && this.state.categories) 
                    ? this.getMeals() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        meals: store.mealReducer.meals,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: (store.appReducer.posting > 0 || store.appReducer.putting > 0 || store.appReducer.deleting > 0) ? true : false,
    };
};
  
const ConnectedMeals = connect(mapStateToProps)(Meals);
export default ConnectedMeals;
