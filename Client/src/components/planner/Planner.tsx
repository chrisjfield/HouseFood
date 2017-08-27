import * as React from 'react';
import * as moment from 'moment';
import Moment from 'react-moment';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/app.css';
BigCalendar.momentLocalizer(moment);

import { 
    Person,
    NewPerson,
} from '../../interfaces/peopleInterfaces';
import { 
    Day,
    NewDay,
} from '../../interfaces/daysInterfaces';
import { Meal } from '../../interfaces/mealsInterfaces';
import { getMeals } from '../../actions/meals/mealActions';
import { getDays } from '../../actions/days/dayActions';
import { getPeople } from '../../actions/people/peopleActions';
import { 
    updateDay,
    addDay, 
    addPeople,
} from '../../actions/planner/plannerActions';

import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

interface PlannerProps {
    days: Day[];
    meals: Meal[];
    people: Person[];
    loading: boolean;
    error: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
}

interface PlannerState {
    calendarView: CalendarItem[];
    selectedDate: Date;
    selectedDayInfo: Day;
    selectedDayPeople: Person[];
    selectedSearchText: string;
    searchTerms: string[];
    searchPeople: string[];
    addPersonText: string;
    selectedPeopleSearchText: string;
    saveValidationMessage: string;
}

interface CalendarItem {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface SlotInfo {
    action: string;
    end: Date;
    start: Date;
    slots: Date[];
}

const styles = {
    calendarContainer: {
        height: '85vh',
    },
    chips: {
        display: 'inline-flex',
        marginRight: '4px',
    },
    add: {
        heigt: '32px',
    },
};

class Planner extends React.Component<PlannerProps, PlannerState> {
    constructor(props: any) {
        super();
    }

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getMeals());
        this.props.dispatch(getPeople());
    }

    componentWillReceiveProps(nextProps: PlannerProps) {
        const mealNames = nextProps.meals 
        ? [...new Set<string>(nextProps.meals.map((meal: Meal) => meal.name))]
        : []; 

        const searchPeople = nextProps.people 
        ? [...new Set<string>(nextProps.people.map((person: Person) => person.person))]
        : [];

        const calendarView = nextProps.days.map((day: Day) => {
            const mealName: string = nextProps.meals ? nextProps.meals.find((meal: Meal) => meal.mealid === day.mealid).name : null;
            const numberOfPeople: string = day.numberofpeople === 0 
                ? 'no one in' 
                : day.numberofpeople === 1 ? '1 person in' : String(day.numberofpeople) + ' people in';

            const calendarItem: CalendarItem = {
                title: mealName + ' - ' + numberOfPeople,
                start: day.date,
                end: day.date,
                allDay: true,
            };
            return calendarItem;
        });
           
        this.setState({
            calendarView,
            searchPeople,
            searchTerms: mealNames,
        });
    }

    daySelected (slotInfo: SlotInfo) {
        const selectedDate: Date = new Date(slotInfo.start);
        this.editDay(selectedDate);
    }

    eventSelected (event: CalendarItem) {
        const selectedDate: Date = new Date(event.start);
        this.editDay(selectedDate);
    }

    editDay (date: Date) {
        const day: Day = this.props.days.find((day: Day) => {
            const dayDate = new Date(day.date);
            return dayDate.toDateString() === date.toDateString();
        });
        const people: Person[] = this.props.people.filter((people: Person) => {
            const personDate = new Date(people.date);
            return personDate.toDateString() === date.toDateString();
        });
        const meal: string = day ? this.props.meals.find((meal: Meal) => meal.mealid === day.mealid).name : undefined;

        this.setState({
            selectedDate: date,
            selectedDayInfo: day,
            selectedDayPeople: people,
            selectedSearchText: meal,
            saveValidationMessage: undefined,
        });
    }

    getCalendar () {
        return (
            <div style={styles.calendarContainer}>
                <br/>
                {this.getEditDialog ()}
                <BigCalendar
                    selectable={true}
                    events={this.state.calendarView}
                    views={['month']}
                    onSelectSlot={(slotInfo: SlotInfo) => this.daySelected(slotInfo)}
                    onSelectEvent={(event: CalendarItem) => this.eventSelected(event)}
                />
            </div>
        );
    }
  
    handleClose = () => {
        this.setState({ selectedDate: undefined });
    }

    handleSave = () => {
        const mealName = this.state.selectedSearchText;
        const meal: Meal = this.props.meals.find((meal: Meal) => meal.name === mealName);
        const mealid: number = meal ? meal.mealid : undefined;
        const people: Person[] = this.state.selectedDayPeople;
        if (!mealid) {
            this.setState({
                saveValidationMessage: 'Meal is invalid - please select a valid meal.',
            });
            return;
        } else {
            this.setState({
                saveValidationMessage: undefined,
            });
        }

        if (this.state.selectedDayInfo) {
            const updatedDate: string = moment(this.state.selectedDayInfo.date).format('YYYY-MM-DD');
            const updatedDay: NewDay = {
                mealid,
                date: updatedDate,
            };
            const originalPeople: Person[] = this.props.people.filter((people: Person) => {
                const personDate = new Date(people.date);
                return moment(personDate).format('YYYY-MM-DD') === updatedDate;
            });
            const newPeople: NewPerson[] = people
                .filter((person: Person) => originalPeople.indexOf(person) === -1)
                .map((person: Person) => { 
                    return {
                        date: moment(person.date).format('YYYY-MM-DD'),
                        person: person.person,
                    };
                },
            );
            const removedPeople: Person[] = originalPeople
                .filter((person: Person) => people.indexOf(person) === -1);
            
            this.props.dispatch(updateDay(updatedDate, updatedDay));
            newPeople.length > 0 ? this.props.dispatch(addPeople(newPeople, updatedDate)) : null;
            // removedPeople.length > 0 ? this.props.dispatch(removePeople(removedPeople)) : null;
            console.log(removedPeople);
        } else {
            const newDay: NewDay = {
                mealid,
                date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
            };
            const newPeople: NewPerson[] = people.map((person: Person) => { 
                return {
                    date: moment(person.date).format('YYYY-MM-DD'),
                    person: person.person,
                };
            });
            this.props.dispatch(addDay(newDay, newPeople));
        }
        this.setState({
            selectedDate: undefined,
        });
    }

    getEditDialog () {
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Save"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleSave}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={<Moment format="dddd - Do MMMM" date={this.state.selectedDate}/>}
                    actions={actions}
                    modal={false}
                    open={this.state.selectedDate ? true : false}
                    onRequestClose={this.handleClose}
                >
                    <div>
                        <br/>
                    </div>
                    <AutoComplete
                        hintText="Select Meal"
                        maxSearchResults={5}
                        dataSource={this.state.searchTerms}
                        searchText={this.state.selectedSearchText ? this.state.selectedSearchText : ''}
                        onUpdateInput={(searchText, dataSource) => this.applyMealSearch(searchText)}
                        errorText={this.state.saveValidationMessage ? this.state.saveValidationMessage : null}
                    />
                    <div>
                        <br/>
                    </div>
                    <div>
                        <form onSubmit={this.handleChipAdd}>
                            {this.state.selectedDayPeople
                                ? this.state.selectedDayPeople.map((person: Person) => this.createChips(person))
                                : null}
                        
                            <AutoComplete
                                hintText="Add Person"
                                maxSearchResults={5}
                                dataSource={this.state.searchPeople}
                                searchText={this.state.selectedPeopleSearchText ? this.state.selectedPeopleSearchText : ''}
                                onUpdateInput={(searchText, dataSource) => this.applyPersonSearch(searchText)}
                            />
                            <FlatButton type="submit" label="Add" />
                        </form>
                    </div>
                </Dialog>
            </div>
        );
    }

    handleChipAdd = (event: any)  => {
        event.preventDefault();
        const personExists: Person = this.state.selectedDayPeople
            .find((person: Person) => person.person.toLowerCase() === this.state.addPersonText.toLowerCase());
        if (!personExists) {
            const newPerson: Person = {
                date: this.state.selectedDate,
                person: this.state.addPersonText,
                personid: undefined,
            };
            this.setState({
                selectedDayPeople: [...this.state.selectedDayPeople, newPerson],
                selectedPeopleSearchText: undefined,
            });
        } else {
            this.setState({
                selectedPeopleSearchText: undefined,
            });
        }
    }

    handleChipDelete(personName: string) {
        this.setState({
            selectedDayPeople: this.state.selectedDayPeople.filter((person: Person) => person.person !== personName),
        });
    }

    createChips (person: Person) {
        return (
            <Chip 
                key={person.person} 
                style={styles.chips} 
                onRequestDelete={() => this.handleChipDelete(person.person)}
            >
                <Avatar size={32}>{person.person.charAt(0).toUpperCase()}</Avatar>
                {person.person}
            </Chip>
        );
    }

    applyPersonSearch (searchText: string) {
        this.setState({
            addPersonText: searchText === '' ? undefined : searchText,
            selectedPeopleSearchText: searchText,
        });
    }

    applyMealSearch (searchText: string) {
        this.setState({
            selectedSearchText: searchText,
        });
    }

    render() {
        return (this.state && this.state.calendarView && this.props.meals 
                && this.props.days && this.props.people) ? this.getCalendar() : null;
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        meals: store.mealReducer.meals,
        days: store.dayReducer.days,
        people: store.peopleReducer.people,
    };
};
  
const ConnectedPlanner = connect(mapStateToProps)(Planner);
export default ConnectedPlanner;        
