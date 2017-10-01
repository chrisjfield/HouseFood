import * as React from 'react';

import { connect } from 'react-redux';
import Moment from 'react-moment';
import * as moment from 'moment';

import { AppLoading } from '../loadingHandler';

import { Day } from '../../interfaces/dayInterfaces';
import { Person } from '../../interfaces/personInterfaces';
import { Meal } from '../../interfaces/mealInterfaces';
import { HomeProps } from '../../interfaces/appInterfaces';
import { AppStore } from '../../interfaces/stateInterfaces';

import { getMeals } from '../../actions/meals/mealActions';
import { getDays } from '../../actions/days/dayActions';
import { getPeople } from '../../actions/people/peopleActions';

import { Card, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';

import styles from '../../styles';

class Home extends React.Component<HomeProps> {

    componentWillMount() {
        this.props.dispatch(getDays());
        this.props.dispatch(getPeople());
        this.props.dispatch(getMeals());
    }

    generateWeek() {
        const dateArray: Date[] = [];
        for (let i = 0; i < 7; i += 1) {
            dateArray.push(moment(new Date()).startOf('week').add(i, 'day').toDate());
        } 
        return (
            <div>
                <br/>
                {dateArray.map((date: Date) => this.getCard(date))}
            </div>
        );
    }

    getCard(rowDate: Date) {
        const day: Day = this.props.days.find((day: Day) => rowDate.toDateString() === new Date(day.date).toDateString());
        const meal: string = day ? this.props.meals.find((meal: Meal) => meal.mealid === day.mealid).name : null;
        const people: Person[] = this.props.people.filter((people: Person) => 
            rowDate.toDateString() === new Date(people.date).toDateString(),
        );
        let noMealMessage: string;
        if (!meal) {
            noMealMessage = 'No meal planned';
        } else if (!people.length) {
            noMealMessage = 'No one in';
        }

        return (
            <Card key={moment(rowDate).day().toString()}>
                <CardText style={styles.cardText}>
                    <h3>{<Moment format="dddd - Do MMMM" date={rowDate}/>}</h3>
                    {noMealMessage ? this.getAddMealOption(noMealMessage) : this.getCardText(people, meal)}
                </CardText>
            </Card>
        );
    }

    getAddMealOption(noMealMessage: string) {
        // this.props.history.push("/Meal")
        return (
            <div> 
                { noMealMessage } 
                <span>
                <FlatButton label="Plan meal" primary={true}/>
                </span>
            </div>
        );
    }

    getCardText(people: Person[], meal: string) {
        const mealText: string = ' with ';

        return (
            <div>
                <b style={{ color: '#0D47A1' }}>{meal}</b>
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
    };
};
  
const ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;        
