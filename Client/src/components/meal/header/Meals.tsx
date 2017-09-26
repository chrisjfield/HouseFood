import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import history from '../../../history';

import { 
    Meal,
    NewMeal, 
} from '../../../interfaces/mealInterfaces';
import { 
    getMeals,
    saveMeal,
    editMeal,
 } from '../../../actions/meals/mealActions';

import {
    List, 
    ListItem,
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import View from 'material-ui/svg-icons/action/visibility';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

interface MealsProps {
    meals: Meal[];
    loading: boolean;
    error: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
}

interface MealsState {
    categories: string[];
    searchTerms: string[];
    searchString: string;
    newMealDialogOpen: boolean;
    newMeal: NewMeal;
    editMealDialogOpen: boolean;
    mealEditing: Meal;
    nameErrorText: string;
    categoryErrorText: string;
}

const styles = {
    search: {
        width: '60%',
        marginLeft: '20%',
    },
    mealNames: {
        display: 'inline-block',
    },
};

class Meals extends React.Component<MealsProps, MealsState> {
    constructor(props: any) {
        super();
    }

    componentWillMount() {
        this.props.dispatch(getMeals());
    }
 
    componentWillReceiveProps(nextProps: MealsProps) {
        const categories = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => meal.category))]
            : []; 

        const mealNames = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => meal.name))]
            : []; 

        this.setState({
            searchTerms: [...categories, ...mealNames],
            categories: categories.sort(),
        });
    }

    handleViewDetails = (mealId: number) => {
        const url: string = '/Meal/Detail/' + String(mealId);
        this.props.history.push(url);
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
                    <ListItem 
                        primaryText={meal.name} 
                        onClick={() => this.handleViewDetails(meal.mealid)}
                    />
                </div>
            </div>
        );
    }

    openNewMealDialog = () => {
        this.setState({
            newMealDialogOpen: true,
            newMeal: {
                name: null,
                category: null,
            },
        });
    }

    handleEdit = (mealid: number) => {
        this.setState({
            editMealDialogOpen: true,
            mealEditing: this.props.meals.find((meal: Meal) => meal.mealid === mealid),
        });
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

    getNewMealDialog = () => {
        return (
            <div>
                <Dialog
                    title="Create Meal"
                    open={this.state.newMealDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveNewMeal}>
                        <TextField
                            hintText="Meal Name"
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editNewName(newValue)}
                        />
                        <AutoComplete
                            hintText="Category"
                            maxSearchResults={5}
                            dataSource={this.state.categories}
                            errorText={this.state.categoryErrorText}
                            onUpdateInput={(searchText: string) => this.editNewCategory(searchText)}
                        />
                        <FlatButton type="submit" label="Add" />
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.handleDialogClose}
                        />
                    </form>
                </Dialog>
            </div>
        );
    }

    editNewName = (newValue: string) => {
        this.setState({ 
            newMeal: { 
                ...this.state.newMeal, 
                name: (newValue !== '') ? newValue : undefined,
            }, 
            nameErrorText: (newValue === '') ? 'Please enter a meal name' : undefined, 
        });
    }

    editNewCategory = (searchText: string) => {
        this.setState({ 
            newMeal: { 
                ...this.state.newMeal, 
                category: (searchText !== '') ? searchText : undefined,
            }, 
            categoryErrorText: (searchText === '') ? 'Please enter a category' : undefined, 
        });
    }

    handleSaveNewMeal = (event: any) => {
        event.preventDefault();
        if (!this.state.newMeal.category || !this.state.newMeal.name) {
            this.setState({ 
                nameErrorText: (!this.state.newMeal.name) ? 'Please enter a meal name' : undefined, 
                categoryErrorText: (!this.state.newMeal.category) ? 'Please enter a category' : undefined, 
            });
        } else {
            this.props.dispatch(saveMeal(this.state.newMeal))
            .then((response: Meal) => {
                const url: string = '/Meal/Edit/' + String(response.mealid);
                history.push(url);
            })
            .catch((error: any) => {
                console.log(error);
            });
        }
    }

    getEditMealDialog = () => {
        return (
            <div>
                <Dialog
                    title="Edit Meal"
                    open={this.state.editMealDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveEditedMeal}>
                        <TextField
                            hintText="Meal Name"
                            defaultValue={this.state.mealEditing.name}
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editEditedName(newValue)}
                        />
                        <AutoComplete
                            hintText="Category"
                            maxSearchResults={5}
                            searchText={this.state.mealEditing.category}
                            dataSource={this.state.categories}
                            errorText={this.state.categoryErrorText}
                            onUpdateInput={(searchText: string) => this.editEditedCategory(searchText)}
                        />
                        <FlatButton type="submit" label="Save" />
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.handleDialogClose}
                        />
                    </form>
                </Dialog>
            </div>
        );        
    }

    editEditedName = (newValue: string) => {
        this.setState({ 
            mealEditing: { 
                ...this.state.mealEditing, 
                name: newValue,
            }, 
            nameErrorText: newValue ? undefined : 'Please enter a meal name', 
        });
    }

    editEditedCategory = (searchText: string) => {
        this.setState({ 
            mealEditing: { 
                ...this.state.mealEditing, 
                category: searchText,
            }, 
            categoryErrorText: searchText ? undefined : 'Please enter a category', 
        });
    }

    handleSaveEditedMeal = (event: any) => {
        event.preventDefault();
        if (!this.state.mealEditing.category || !this.state.mealEditing.name) {
            this.setState({ 
                nameErrorText: !this.state.mealEditing.name ? 'Please enter a meal name' : undefined, 
                categoryErrorText: !this.state.mealEditing.category ? 'Please enter a category' : undefined, 
            });
        } else {
            this.props.dispatch(editMeal(this.state.mealEditing));
            this.handleDialogClose();
        }
    }

    createLists = (category: string) => {
        const filteredMeals: Meal[] = this.props.meals
            .filter((meal: Meal) => {
                return meal.category === category 
                    && ((meal.name.toLowerCase().includes(this.state.searchString) 
                            || meal.category.toLowerCase().includes(this.state.searchString)) 
                        || !this.state.searchString);
            })
            .sort((a,b) => {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);});
        return (
            filteredMeals.length === 0 ? null :
            <div key={category}>
                <Subheader>{category}</Subheader>
                <List> 
                    {filteredMeals.map((meal: Meal) => this.createListItem(meal))}
                </List>
                <Divider />
            </div>
        );
    }
    
    applySearch = (search: string) => {
        const searchString: string = search === '' ? null : search.toLowerCase();
        this.setState({
            searchString,
        });
    }

    createSearch = () => {
        return (
            <AutoComplete
                hintText="Search"
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={5}
                dataSource={this.state.searchTerms}
                onUpdateInput={(searchText, dataSource) => this.applySearch(searchText)}
                fullWidth={true}
                style={styles.search}
            />
        );
    }

    render() {
        return (
            <div>
                <br/>
                <FlatButton
                    label="Add Meal"
                    primary={true}
                    onClick={this.openNewMealDialog}
                />
                {(this.state && this.state.editMealDialogOpen && this.state.mealEditing)
                    ? this.getEditMealDialog()
                    : null}
                {(this.state && this.state.newMealDialogOpen)
                    ? this.getNewMealDialog()
                    : null}
                {(this.state && this.state.searchTerms && this.props.meals)
                 ? this.createSearch()
                 : null}
                {(this.state && this.state.searchTerms && this.props.meals)
                 ? this.state.categories.map((category: string) => this.createLists(category)) 
                 : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        meals: store.mealReducer.meals,
        loading: store.listReducer.loading,
        error: store.listReducer.error,
        updating: store.listReducer.updating,
    };
};
  
const ConnectedMeals = connect(mapStateToProps)(Meals);
export default ConnectedMeals;
