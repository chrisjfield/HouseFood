import * as React from 'react';

import { connect } from 'react-redux';
import * as moment from 'moment';
import Moment from 'react-moment';
import BigCalendar from 'react-big-calendar';
BigCalendar.momentLocalizer(moment);

import history from '../../history';
import { AppLoading, AppUpdating } from '../loadingHandler';

import textHelper from '../../helpers/textHelper';
import validationHelper from '../../helpers/validationHelper';

import { AppStore } from '../../interfaces/stateInterfaces';
import { Person, NewPerson } from '../../interfaces/personInterfaces';
import { Day, NewDay } from '../../interfaces/dayInterfaces';
import { CalendarItem, SlotInfo, PlannerProps, PlannerState } from '../../interfaces/plannerInterfaces';
import { List, GenerateListDetail } from '../../interfaces/listInterfaces';
import { Meal } from '../../interfaces/mealInterfaces';

import { getMeals } from '../../actions/meals/mealActions';
import { getDays, addDay, updateDay } from '../../actions/days/dayActions';
import { getPeople, addPeople, removePeople } from '../../actions/people/peopleActions';
import { generateList } from '../../actions/planner/plannerActions';

import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/css/app.css';
import styles from '../../styles';

class Planner extends React.Component<PlannerProps, PlannerState> {
    constructor(props: any) {
        super();

        this.state = {
            calendarView: undefined,
            selectedDate: undefined,
            selectedDayInfo: undefined,
            selectedDayPeople: undefined,
            selectedSearchText: '',
            searchTerms: undefined,
            searchPeople: undefined,
            addPersonText: undefined,
            selectedPeopleSearchText: '',
            saveValidationMessage: undefined,
            generateListDialogOpen: false,
            generateListDialogStart: undefined,
            generateListDialogEnd: undefined,
            generateListDialogListName: '',
            generateListDialogValidationMessage: undefined,
            generateListDialogStartValidation: undefined,
            generateListDialogEndValidation: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getMeals());
        this.props.dispatch(getPeople());
    }

    componentWillReceiveProps(nextProps: PlannerProps) {
        const mealNames = nextProps.meals 
            ? [...new Set<string>(nextProps.meals.map((meal: Meal) => textHelper.toTitleCase(meal.name)))]
            : []; 
        const searchPeople = nextProps.people 
            ? [...new Set<string>(nextProps.people.map((person: Person) => textHelper.toTitleCase(person.person)))]
            : [];
        const calendarView = nextProps.days
            ? nextProps.days.map((day: Day) => {
                const mealName: string = nextProps.meals 
                    ? nextProps.meals.find((meal: Meal) => meal.mealid === day.mealid).name 
                    : null;
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
            })
            : null;
           
        this.setState({
            calendarView,
            searchPeople,
            searchTerms: mealNames,
        });
    }

    getCalendar () {
        return (
            <div style={styles.calendarContainer}>
                <br/>
                {this.getEditDialog()}
                {this.getgenerateListDialog()}
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

    getEditDialog () {
        const actions = [
            <FlatButton label="Save" primary={true} onClick={this.handleSave} rippleColor={'#263238'}/>,
            <FlatButton key="cancel" label="Cancel" secondary={true} onClick={this.handleClose} rippleColor={'#263238'}/>,
        ];

        return (
            <div>
                <Dialog
                    title={<Moment format="dddd - Do MMMM" date={this.state.selectedDate}/>}
                    actions={this.props.updating ? [<AppUpdating/>] : actions}
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
                        return { date: moment(person.date).format('YYYY-MM-DD'), person: person.person };
                    },
                );
                const removedPeople: Person[] = originalPeople
                    .filter((person: Person) => people.indexOf(person) === -1);
                
                Promise.all([
                    this.props.dispatch(updateDay(updatedDate, updatedDay)),
                    newPeople.length > 0 ? this.props.dispatch(addPeople(newPeople, updatedDate)) : null,
                    removedPeople.length > 0 ? this.props.dispatch(removePeople(removedPeople, updatedDate)) : null,
                ])
                .then((response: any) => {
                    this.setState({ selectedDate: undefined });
                })
                .catch((error: any) => {
                    console.log(error);
                });
            } else {
                const newDay: NewDay = { mealid, date: moment(this.state.selectedDate).format('YYYY-MM-DD') };
                const newPeople: NewPerson[] = people.map((person: Person) => { 
                    return { date: moment(person.date).format('YYYY-MM-DD'),person: person.person };
                });
                this.props.dispatch(addDay(newDay, newPeople))
                .then((response: Day[]) => {
                    this.setState({ selectedDate: undefined });
                })
                .catch((error: any) => {
                    console.log(error);
                });
            }  
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
            generateListDialogOpen: false,
            generateListDialogStart: undefined,
            generateListDialogEnd: undefined,
            generateListDialogListName: '',
            generateListDialogValidationMessage: undefined,
            generateListDialogStartValidation: undefined,
            generateListDialogEndValidation: undefined,
            selectedSearchText: '',
            saveValidationMessage: undefined,
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
            <FlatButton key="add" type="submit" label="Add" primary={true} rippleColor={'#263238'}/>,
        ];

        return (
            <form onSubmit={this.handleChipAdd}>
                <div style={{ height: '40px', display: 'inline-block' }}>
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
                {this.props.updating ? [<AppUpdating/>] : actions}
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
            <Chip key={person.person} style={styles.chips} onRequestDelete={() => this.handleChipDelete(person.person)}>
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

    getgenerateListDialog () {
        const actions = [
            <FlatButton key="generateList" 
                label="Generate List" 
                primary={true} 
                keyboardFocused={true} 
                onClick={this.handleGenerateList} 
                rippleColor={'#263238'}
            />,
            <FlatButton key="cancel" label="Cancel" secondary={true} onClick={this.handleClose} rippleColor={'#263238'}/>,
        ];

        return (
            <div>
                <Dialog
                    title="Generate List"
                    actions={this.props.updating ? [<AppUpdating/>] : actions}
                    open={this.state.generateListDialogOpen}
                    onRequestClose={this.handleClose}
                >
                Would you like to generate a shopping list for the following date range?
                    <div>
                        <br/>
                    </div>
                    <TextField
                        hintText="Weekly Shop"
                        floatingLabelText="List Name"
                        value={this.state.generateListDialogListName}
                        onChange={this.handleChangeListName}
                        errorText={this.state.generateListDialogValidationMessage}
                    />
                    <div>
                        <br/>
                    </div>
                    <DatePicker 
                        hintText="2017/01/01"
                        floatingLabelText="Start Date"
                        autoOk={true} 
                        defaultDate={this.state.generateListDialogStart}
                        onChange={this.handleChangeStartDate}
                        shouldDisableDate={this.disableDatesPastEnd}
                        errorText={this.state.generateListDialogStartValidation}
                    />
                    <div>
                        <br/>
                    </div>
                    <DatePicker 
                        hintText="2017/01/07"
                        floatingLabelText="End Date"
                        autoOk={true} 
                        defaultDate={this.state.generateListDialogEnd}
                        onChange={this.handleChangeEndDate}
                        shouldDisableDate={this.disableDatesBeforeStart}
                        errorText={this.state.generateListDialogEndValidation}
                    />
                </Dialog>
            </div>
        );
    }

    handleGenerateList = () => {
        const newList: GenerateListDetail = {
            listName: this.state.generateListDialogListName,
            startDate: this.state.generateListDialogStart,
            endDate: this.state.generateListDialogEnd,
        };
        
        if (this.validateList(newList)) {
            this.props.dispatch(generateList(newList))
            .then((response: List) => {
                const url: string = '/List/Detail/' + String(response[0].listid);
                history.push(url);
            })
            .catch((error: any) => {
                console.log(error);
            });
        }
    }

    validateList = (newList: GenerateListDetail) => {     
        const isValid: boolean = (!this.validateListName(newList.listName) && !this.validateListStart(newList.startDate)
                                  && !this.validateListEnd(newList.endDate)) ? true : false;

        return isValid;
    }

    validateListName = (name: string) => {
        const validationMessage: string = validationHelper.validateListName(name);

        this.setState({ generateListDialogValidationMessage: validationMessage });

        return validationMessage;
    }

    validateListStart = (start: Date) => {
        const validationMessage: string = validationHelper.validateListStart(start);

        this.setState({ generateListDialogStartValidation: validationMessage });

        return validationMessage;
    }

    validateListEnd = (end: Date) => {
        const validationMessage: string = validationHelper.validateListEnd(end);

        this.setState({ generateListDialogEndValidation: validationMessage });

        return validationMessage;
    }
    handleChangeListName = (event: object, listName: string) => {
        this.setState({ generateListDialogListName: listName });
        this.validateListName(listName);
    }

    handleChangeStartDate = (event: object, date: Date) => {
        this.setState({ generateListDialogStart: date });
        this.validateListStart(date);
    }

    disableDatesPastEnd = (date: Date) => {
        return date > this.state.generateListDialogEnd;
    }

    handleChangeEndDate = (event: object, date: Date) => {
        this.setState({ generateListDialogEnd: date });
        this.validateListEnd(date);
    }

    disableDatesBeforeStart = (date: Date) => {
        return date < this.state.generateListDialogStart;
    }
   
    daySelected (slotInfo: SlotInfo) {
        if (slotInfo.slots.length === 1) {
            const selectedDate: Date = new Date(slotInfo.start);
            this.editDay(selectedDate);
        } else {
            this.setState({
                generateListDialogOpen: true,
                generateListDialogStart: new Date(slotInfo.start),
                generateListDialogEnd: new Date(slotInfo.end),
            });
        }
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

    eventSelected (event: CalendarItem) {
        const selectedDate: Date = new Date(event.start);
        this.editDay(selectedDate);
    }

    render() {
        return (
            <div>
                {(!this.props.loading && this.props.days && this.props.meals && this.props.people
                  && this.state && this.state.calendarView) 
                    ? this.getCalendar()
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
  
const ConnectedPlanner = connect(mapStateToProps)(Planner);
export default ConnectedPlanner;        
