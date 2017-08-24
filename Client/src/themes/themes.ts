import {
    fullBlack,
    grey300,
    grey500,
    blue900,
  } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
  
const theme = getMuiTheme({
    palette: {
        primary1Color: blue900,
        textColor: fullBlack,
        alternateTextColor: grey500,
        borderColor: grey300,
        pickerHeaderColor: blue900,
        shadowColor: blue900,
    },
});

export default theme;
