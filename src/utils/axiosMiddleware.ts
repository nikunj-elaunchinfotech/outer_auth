import axios from 'axios'
import { Url } from 'url';

function AxiosMiddleware(method:String, url:String, data:any, options:any) {
    /* if(data.env != 'test' && url.search("env=test") == -1) {
         data = (new Security).encrypt(data);
     }*/

    switch (method) {
        case 'get':
            return axios.get(url, data, options);
        case 'post':
            return axios.post(url, data, options);
        case 'head':
            return axios.head(url, data, options);
        case 'patch':
            return axios.patch(url, data, options);
        case 'put':
            return axios.put(url, data, options);
        case 'delete':
            return axios.delete(url, { data: data, headers: options });
    }

}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = "token.content";
// navigate = useNavigate();

axios.interceptors.response.use(
    (response) => {
        if (response.data.mac !== undefined) {
            response.data = (new Security).decrypt(response.data);
        }
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            // navigate('/login')
        }
        return Promise.reject(error);
    }
)

export function callApi(url:any[], data = {}, options = {}) {
    return AxiosMiddleware(url[0], process.env.REACT_APP_BASE_URL + url[1], data, options)
}


export function setBearerToken(token:String) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export function setVerifyToken(token:String) {
    axios.defaults.headers.common['VerifyToken'] = `${token}`;
}
export function setLocalizationLanguage(language:String) {
    axios.defaults.headers.common['X-localization'] = `${language}`;
}

//  Http.callApi(url.login, JSON.stringify(data), config).then();
 