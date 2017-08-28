import baseURL from '../appConfig';

class APIHelper {
    static apiCall(method : string, endpoint : string, body? : object, urlParams? : string) {
        const customheaders = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        const headers = new Headers(customheaders);
        let calledUrl = `${baseURL}${endpoint}`;
  
        if (urlParams) {
            calledUrl += `?${urlParams}`;
        }
  
        return fetch(calledUrl, {
            method,
            headers,
            mode: 'cors',
            body: body ? JSON.stringify(body) : undefined,
        })
        .then((response : any) => APIHelper.checkStatus(response))
        .catch((error : any) => {
            throw(error);
        });
    }
  
    static checkStatus(response : any) {
        if (response.ok && response.status === 204) {
            return true;
        } else if (response.ok) {
            return response.json();
        } else {
            const error = new Error(response.statusText);
            throw error;
        }
    }
}
  
export default APIHelper;
