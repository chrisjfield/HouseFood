import {
    darkBlack,
    fullBlack,
    grey500,
    blue900,
  } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
  
const theme = getMuiTheme({
    palette: {
        primary1Color: blue900,
        textColor: fullBlack,
        alternateTextColor: grey500,
        borderColor: darkBlack,
        pickerHeaderColor: blue900,
        shadowColor: fullBlack,
    },
});

export default theme;
