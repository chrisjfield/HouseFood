import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Meal } from '../../interfaces/mealsInterfaces';
import { getMeals } from '../../actions/meals/mealActions';

import {
    List, 
    ListItem,
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import ActionView from 'material-ui/svg-icons/action/visibility';

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
}

const styles = {
    search: {
        width: '60%',
        marginLeft: '20%',
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
        const url: string = '/Meals/' + String(mealId);
        this.props.history.push(url);
    }

    createListItem = (meal: Meal) => {   
        return (
            <ListItem 
                key={meal.mealid} 
                primaryText={meal.name} 
                leftIcon={<ActionView />} 
                onClick={() => this.handleViewDetails(meal.mealid)}
            />
        );
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
        loading: store.listsReducer.loading,
        error: store.listsReducer.error,
        updating: store.listsReducer.updating,
    };
};
  
const ConnectedMeals = connect(mapStateToProps)(Meals);
export default ConnectedMeals;
