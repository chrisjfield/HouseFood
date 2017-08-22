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
            console.log(error);
            throw(error);
        });
    }
  
    static checkStatus(response : any) {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText)); 
        }
    }
}
  
export default APIHelper;
