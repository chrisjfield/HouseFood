import * as React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import * as moment from 'moment';

import { AppLoading, AppUpdating } from '../loadingHandler';

import textHelper from '../../helpers/textHelper';
import validationHelper from '../../helpers/validationHelper';

import { Day, NewDay } from '../../interfaces/dayInterfaces';
import { Person, NewPerson } from '../../interfaces/personInterfaces';
import { Meal } from '../../interfaces/mealInterfaces';
import { HomeProps, HomeState } from '../../interfaces/appInterfaces';
import { AppStore } from '../../interfaces/stateInterfaces';

import { getMeals } from '../../actions/meals/mealActions';
import { getDays, addDay } from '../../actions/days/dayActions';
import { getPeople } from '../../actions/people/peopleActions';

import { Card, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import styles from '../../styles';

class Home extends React.Component<HomeProps, HomeState> {
    
    constructor(props: any) {
        super();

        this.state = {
            selectedDate: undefined,
            selectedSearchText: '',
            saveValidationMessage: undefined,
            searchTerms: undefined,
            selectedDayPeople: [],
            addPersonText: undefined,
            selectedPeopleSearchText: '',
            searchPeople: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getPeople());
        this.props.dispatch(getMeals());
    }

    componentWillReceiveProps(nextProps: HomeProps) {
        const mealNames = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => textHelper.toTitleCase(meal.name)))]
            : []; 
        const searchPeople = nextProps.people 
            ? [...new Set<string>(nextProps.people.map((person: Person) => textHelper.toTitleCase(person.person)))]
            : [];
          
        this.setState({
            searchPeople,
            searchTerms: mealNames,
        });
    }

    generateWeek() {
        const dateArray: Date[] = [];
        for (let i = 0; i < 7; i += 1) {
            dateArray.push(moment(new Date()).startOf('week').add(i, 'day').toDate());
        } 
        
        return (
            <div>
                {this.getPlanMealDialog()}
                <br/>
                {dateArray.map((date: Date) => this.getCard(date))}
            </div>
        );
    }

    getPlanMealDialog () {
        const actions = [
            <FlatButton label="Save" primary={true} onClick={this.handleSave}/>,
            <FlatButton key="cancel" label="Cancel" secondary={true} onClick={this.handleClose}/>,
        ];

        return (
            <div>
                <Dialog
                    title={<Moment format="dddd - Do MMMM" date={this.state.selectedDate}/>}
                    actions={this.props.updating ? [<AppUpdating key="saving"/>] : actions}
                    open={this.state.selectedDate ? true : false}
                    onRequestClose={this.handleClose}
                >
                    <div>
                        <br/>
                    </div>
                    <AutoComplete
                        hintText="Auto completes from your meals"
                        floatingLabelText="Select Meal"
                        maxSearchResults={5}
                        dataSource={this.state.searchTerms}
                        searchText={this.state.selectedSearchText}
                        onUpdateInput={(searchText, dataSource) => this.applyMealSearch(searchText)}
                        errorText={this.state.saveValidationMessage}
                    />
                    <div>
                        <br/>
                    </div>
                    <div>
                        {this.getAddPerson()}
                    </div>
                </Dialog>
            </div>
        );
    }

    handleSave = () => {
        const mealName = this.state.selectedSearchText;
        const meal: Meal = mealName
            ? this.props.meals.find((meal: Meal) => textHelper.toTitleCase(meal.name) === textHelper.toTitleCase(mealName))
            : undefined;
        const mealid: number = meal ? meal.mealid : undefined;
        const people: Person[] = this.state.selectedDayPeople;

        if (!this.validateMeal(mealName, mealid)) {
            const newDay: NewDay = { mealid, date: moment(this.state.selectedDate).format('YYYY-MM-DD') };
            const newPeople: NewPerson[] = people.map((person: Person) => { 
                return { date: moment(person.date).format('YYYY-MM-DD'),person: person.person };
            });
            this.props.dispatch(addDay(newDay, newPeople))
            .then((response: Day[]) => {
                this.handleClose();
            })
            .catch((error: any) => {
                console.log(error);
            });
        }
    }

    validateMeal = (mealName: string, mealid: number) => {
        const validationMessage: string = validationHelper.validateMeal(mealName, mealid);

        this.setState({ saveValidationMessage: validationMessage });

        return validationMessage;
    }

    handleClose = () => {
        this.setState({ 
            selectedDate: undefined, 
            selectedSearchText: '',
            saveValidationMessage: undefined,
            selectedDayPeople: [],
            selectedPeopleSearchText: '',
        });
    }

    applyMealSearch (mealName: string) {
        this.setState({
            selectedSearchText: textHelper.toTitleCase(mealName),
            saveValidationMessage: '',
        });
    }

    getAddPerson() {
        const actions = [
            <FlatButton key="add" type="submit" label="Add" primary={true}/>,
        ];

        return (
            <form onSubmit={this.handleChipAdd}>
                <div style={styles.addPerson}>
                    {this.state.selectedDayPeople
                        ? this.state.selectedDayPeople.map((person: Person) => this.createChips(person))
                        : null}
                </div>
                <br/>
                <AutoComplete
                    hintText="People attending the meal"
                    floatingLabelText="Add Person"
                    maxSearchResults={5}
                    searchText={this.state.selectedPeopleSearchText}
                    dataSource={this.state.searchPeople}
                    onUpdateInput={(searchText, dataSource) => this.applyPersonSearch(searchText)}
                />
                {this.props.updating ? [<AppUpdating key="adding"/>] : actions}
            </form>
        );
    }

    handleChipAdd = (event: any)  => {
        event.preventDefault();
        const personExists: Person = this.state.addPersonText
            ? this.state.selectedDayPeople
                .find((person: Person) => textHelper.toTitleCase(person.person) === textHelper.toTitleCase(this.state.addPersonText))
            : undefined;

        if (!personExists && this.state.addPersonText) {
            const newPerson: Person = {
                date: this.state.selectedDate,
                person: this.state.addPersonText,
                personid: undefined,
            };
            this.setState({
                selectedDayPeople: [...this.state.selectedDayPeople, newPerson],
                selectedPeopleSearchText: '',
            });
        } else {
            this.setState({
                selectedPeopleSearchText: '',
            });
        }
    }

    createChips (person: Person) {
        return (
            <Chip key={person.person} style={styles.chip} onRequestDelete={() => this.handleChipDelete(person.person)}>
                <Avatar size={32}>{textHelper.toTitleCase(person.person).charAt(0)}</Avatar>
                {person.person}
            </Chip>
        );
    }
    
    handleChipDelete(personName: string) {
        this.setState({
            selectedDayPeople: this.state.selectedDayPeople.filter((person: Person) => person.person !== personName),
        });
    }

    applyPersonSearch (personName: string) {
        this.setState({
            addPersonText: textHelper.toTitleCase(personName),
            selectedPeopleSearchText: textHelper.toTitleCase(personName),
        });
    }

    getCard(rowDate: Date) {
        const day: Day = this.props.days.find((day: Day) => rowDate.toDateString() === new Date(day.date).toDateString());
        const mealName: string = day ? this.props.meals.find((meal: Meal) => meal.mealid === day.mealid).name : null;
        const mealid: number = day ? day.mealid : null;
        const people: Person[] = this.props.people.filter((people: Person) => 
            rowDate.toDateString() === new Date(people.date).toDateString(),
        );
        let noMealMessage: string;
        let messageType: number;

        if (!mealName) {
            noMealMessage = 'No meal planned';
            messageType = 1;
        } else if (!people.length) {
            noMealMessage = 'No one in';
            messageType = 2;
        }

        return (
            <Card key={moment(rowDate).day().toString()}>
                <CardText style={styles.cardText}>
                    <h3>{<Moment format="dddd - Do MMMM" date={rowDate}/>}</h3>
                    {noMealMessage 
                        ? this.getAddMealOption(noMealMessage, messageType, rowDate) 
                        : this.getCardText(people, mealName, mealid)}
                </CardText>
            </Card>
        );
    }

    getAddMealOption(noMealMessage: string, messageType: number, date: Date) {
        return (
            <div> 
                { noMealMessage } 
                {messageType !== 2 
                    ?  (<span>
                            <FlatButton key="planning" label="Plan meal" primary={true} onClick={() => this.planMeal(date)}/>
                        </span>)
                    : null}
            </div>
        );
    }

    planMeal = (date: Date) => {
        this.setState({ selectedDate: date });
    }

    getCardText(people: Person[], meal: string, mealid: number) {
        const mealText: string = ' with ';

        return (
            <div>
                <Link to={'/Meal/Detail/' + mealid} key={mealid} style={styles.personChip}>
                    <b>
                        {meal}
                    </b>
                </Link>
                {mealText}
                {people.map((person: Person) => this.getPerson(person))}
            </div>
        );
    }

    getPerson(person: Person) {
        return (
            <Chip key={person.personid} style={styles.chip}>
                <Avatar>{person.person.charAt(0).toUpperCase()}</Avatar>
                {person.person}
            </Chip>
        );
    }

    render() {
        return (
            <div>
                {!this.props.loading && this.props.days && this.props.people && this.props.meals 
                 && this.state && this.state.searchTerms
                    ? this.generateWeek() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        meals: store.mealReducer.meals,
        days: store.dayReducer.days,
        people: store.personReducer.people,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: (store.appReducer.posting > 0 || store.appReducer.putting > 0 || store.appReducer.deleting > 0) ? true : false,
    };
};
  
const ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;        
