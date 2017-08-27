import * as React from 'react';
import * as moment from 'moment';
import Moment from 'react-moment';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/app.css';
BigCalendar.momentLocalizer(moment);

import { Person } from '../../interfaces/peopleInterfaces';
import { Day } from '../../interfaces/daysInterfaces';
import { Meal } from '../../interfaces/mealsInterfaces';
import { getMeals } from '../../actions/meals/mealActions';
import { getDays } from '../../actions/days/dayActions';
import { getPeople } from '../../actions/people/peopleActions';

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
                        onUpdateInput={(searchText, dataSource) => this.applySearch(searchText)}
                    />
                    <div>
                        <br/>
                    </div>
                    <div>
                        {this.state.selectedDayPeople
                            ? this.state.selectedDayPeople.map((person: Person) => this.createChips(person))
                            : null}
                        <Chip key="add" style={styles.chips} onTouchTap={this.handleChipAdd}>
                            <Avatar size={32}>+</Avatar>
                            Add person
                        </Chip>
                    </div>
                </Dialog>
            </div>
        );
    }

    handleChipAdd () {
        console.log('chip added');
    }

    handleChipDelete(personid: number) {
        this.setState({
            selectedDayPeople: this.state.selectedDayPeople.filter((person: Person) => person.personid !== personid),
        });
    }

    createChips (person: Person) {
        return (
            <Chip 
                key={person.personid} 
                style={styles.chips} 
                onRequestDelete={() => this.handleChipDelete(person.personid)}
            >
                <Avatar size={32}>{person.person.charAt(0).toUpperCase()}</Avatar>
                {person.person}
            </Chip>
        );
    }

    applySearch (searchText: string) {
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
