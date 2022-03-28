import { Url } from 'url';
import axios from "axios";

async function AxiosMiddleware(method:string, url:string, data:any, options:any) {
    /* if(data.env != 'test' && url.search("env=test") == -1) {
         data = (new Security).encrypt(data);
     }*/

    switch (method) {
        case 'get':
            return await axios.get(url, data);
        case 'post':
            return await axios.post(url, data, options);
        case 'head':
            return await axios.head(url, data);
        case 'patch':
            return await axios.patch(url, data, options);
        case 'put':
            return await axios.put(url, data, options);
        case 'delete':
            return await axios.delete(url, { data: data, headers: options });
    }
}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = "token.content";
// navigate = useNavigate();
const config = require("config");

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
    return AxiosMiddleware(url[0], config.get("BASE_URL") + url[1], data, options)
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