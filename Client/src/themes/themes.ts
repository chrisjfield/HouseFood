import {
  grey400,
  grey700,
  grey900,
  blue900,
  blueGrey700,
  blueGrey800,
  blueGrey900,
} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const theme: __MaterialUI.Styles.MuiTheme = getMuiTheme({
    palette: {
        primary1Color: blue900,
        primary2Color: blue900,
        textColor: grey400,
        borderColor: blueGrey700,
        disabledColor: grey900,
        pickerHeaderColor: blue900,
        canvasColor: blueGrey900,
        alternateTextColor: grey400,
        accent2Color: blueGrey800,
        accent3Color: grey400,
    },
    toolbar: {
        color: grey900,
        backgroundColor: blue900,
        iconColor: grey400,
    },
    avatar: {
        backgroundColor: blue900,
        color: grey400,
    },
    textField: {
        backgroundColor: grey700,
    },
});

export default theme;
