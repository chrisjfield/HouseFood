import * as React from 'react';
import * as moment from 'moment';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/app.css';
BigCalendar.momentLocalizer(moment);

import { Day } from '../../interfaces/daysInterfaces';
import { Meal } from '../../interfaces/mealsInterfaces';
import { getMeals } from '../../actions/meals/mealActions';
import { getDays } from '../../actions/days/dayActions';



interface PlannerProps {
    days: Day[];
    meals: Meal[];
    loading: boolean;
    error: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
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

interface PlannerState {
    calendarView: CalendarItem[];
}

const styles = {
    calendarContainer: {
        height: '85vh',
    },
};

class Planner extends React.Component<PlannerProps, PlannerState> {
    constructor(props: any) {
        super();
    }

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getMeals());
    }

    componentWillReceiveProps(nextProps: PlannerProps) {
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
        });
    }

    daySelected (slotInfo: SlotInfo) {
        console.log(slotInfo);
    }

    eventSelected (event: CalendarItem) {
        console.log(event);
    }

    getCalendar () {
        return (
            <div style={styles.calendarContainer}>
                <br/>
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
    render() {
        return (this.state && this.state.calendarView && this.props.meals) ? this.getCalendar() : null;
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        meals: store.mealReducer.meals,
        days: store.dayReducer.days,
    };
};
  
const ConnectedPlanner = connect(mapStateToProps)(Planner);
export default ConnectedPlanner;        

        
