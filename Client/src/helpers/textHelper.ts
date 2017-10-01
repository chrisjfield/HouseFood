class textHelper {
    static toTitleCase(text: string) {
        const lowers: string[] = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
            'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
        const uppers: string[] = ['Id', 'Tv'];

        let titleCaseString: string = text.replace(/([^\W_]+[^\s-]*) */g, (replaceText: string) => {
            return replaceText.charAt(0).toUpperCase() + replaceText.substr(1).toLowerCase();
        });
             
        for (let i = 0, j = lowers.length; i < j; i += 1) {
            titleCaseString = titleCaseString.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), (replaceText: string) => {
                return replaceText.toLowerCase();
            });
        }
           
        for (let i = 0, j = uppers.length; i < j; i += 1) {
            titleCaseString = titleCaseString.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());
        }
      
        return titleCaseString;
    }

    static getArrayFromProperty<T>(initialOject: T[], property: string): string[] {
        const array: string[] = [];

        if (initialOject) {
            initialOject.map((element: T) => {
                const value: string = this.toTitleCase(element[property]);
                if (array.indexOf(value) === -1) {
                    array.push(value);
                }
            });
        }

        return array;
    }
}
  
export default textHelper;
