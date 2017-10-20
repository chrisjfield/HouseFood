import * as moment from 'moment';
import { GenerateListDetail, GenerateListDetailServer } from '../interfaces/listInterfaces';

class dateHelper {
    static formatListDates = (newList: GenerateListDetail) => {
        const formattedList: GenerateListDetailServer = {
            listName: '',
            startDate: '',
            endDate: '',
        };
        formattedList.listName = newList.listName;
        formattedList.startDate = moment(newList.startDate).format('YYYY-MM-DD').toString();
        formattedList.endDate = moment(newList.endDate).format('YYYY-MM-DD').toString();
        return formattedList;
    }
}

export default dateHelper;
