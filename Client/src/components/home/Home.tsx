import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Moment from 'react-moment';

import { Day } from '../../interfaces/daysInterfaces';
import { Person } from '../../interfaces/peopleInterfaces';
import { Meal } from '../../interfaces/mealsInterfaces';
import { getMeals } from '../../actions/meals/mealActions';
import { getDays } from '../../actions/days/dayActions';
import { getPeople } from '../../actions/people/peopleActions';

import {
    Card, 
    CardText,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

interface HomeProps {
    days: Day[];
    people: Person[];
    meals: Meal[];
    loading: boolean;
    error: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
}

interface HomeState {
}

const styles = {
    chips: {
        display: 'inline-flex',
        marginRight: '4px',
    },
};

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: any) {
        super();
    }

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getPeople());
        this.props.dispatch(getMeals());
    }

    getMonday() {
        const currentDate: Date = new Date();
        const currentDay: number = currentDate.getDay();
        const diff: number = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 :1); // adjust when day is sunday
        const finaldate: Date = new Date(currentDate.setDate(diff));
        return finaldate;
    }

    addDays(date: Date, days: number) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    getPerson(person: Person) {
        return (
            <Chip key={person.personid} style={styles.chips}>
                <Avatar size={32}>{person.person.charAt(0).toUpperCase()}</Avatar>
                {person.person}
            </Chip>
        );
    }

    getCard(rowDate: Date) {
        const day: Day = this.props.days.find((day: Day) => {
            const mapDate = new Date(day.date);
            return rowDate.toDateString() === mapDate.toDateString();
        });
        const meal: string = day ? this.props.meals.find((meal: Meal) => meal.mealid === day.mealid).name : null;
        const people: Person[] = this.props.people.filter((people: Person) => {
            const personDate = new Date(people.date);
            return rowDate.toDateString() === personDate.toDateString();
        });
        return (
            <Card key={rowDate.getDay().toString()}>
                <CardText>
                    <label>{<Moment format="dddd - Do MMMM" date={rowDate}/>}</label><br/>
                    <label>Meal: </label>{meal}<br/>
                    <label>People: </label>{people.map((person: Person) => this.getPerson(person))}
                </CardText>
            </Card>
        );
    }

    generateWeek() {
        const modaysDate: Date = this.getMonday();
        const dateArray: Date[] = [modaysDate];
        for (let i = 1; i < 7; i += 1) {
            dateArray.push(this.addDays(modaysDate, i));
        } 
        return dateArray.map((date: Date) => this.getCard(date));
    }

    render() {
        return (
            <div>
                {(this.props.days && this.props.people && this.props.meals) ? this.generateWeek() : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        meals: store.mealReducer.meals,
        days: store.dayReducer.days,
        people: store.peopleReducer.people,
    };
};
  
const ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;        
