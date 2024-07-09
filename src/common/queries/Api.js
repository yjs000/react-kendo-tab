import {apiAxios} from "@/common/axios/Axios.jsx";

const { VITE_DEFAULT_PATH } = import.meta.env;

export default {
    async publicKey() {
        const response = await apiAxios.post(VITE_DEFAULT_PATH + `/v1/public-key`);
        return response.data.item.publicKey;
    },

    async post(data, url) {
        const response = await apiAxios.post(VITE_DEFAULT_PATH + url, data);
        // console.log(VITE_DEFAULT_PATH + url, data, response)
        return response.data || {};
    },

    /* 노선관리 api */
    async rmPost(data, url) {
        const response = await apiAxios.post('/gunsan-bms-api/route-management'+ url, data);
        return response.data || {};
    },

    async postAll(paramList) {
        const apis = paramList.map(param => apiAxios.post(VITE_DEFAULT_PATH + param.url, param.data))
        const response = await Promise.all(apis);
        return response.map(res => res.data ?? [])
    },

    async form(data, url) {
        const response = await apiAxios.post(VITE_DEFAULT_PATH + url, data, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "multipart/form-data"
            }
        });

       // console.log(VITE_DEFAULT_PATH + url, data, response)
        return response.data;
    },

    async file(data, url) {
        const response = await apiAxios.post(VITE_DEFAULT_PATH + url, data, {responseType : 'blob'});
        // console.log(VITE_DEFAULT_PATH + url, data, response)
        return response;
    }
};
