import api from "@/common/queries/Api.js";

const callApi = async (url, data) => {
    try {
        const response = await api.post(data, url);
        console.log("res", response)
        return response.data; // API 호출 결과 반환
    } catch (error) {
        throw new Error(error); // 에러 처리
    }
};


// export const fetchDetails = async (endpoint, id) => {
//     const response = await axios.get(`${endpoint}/${id}`);
//     return response;
// };
//
// export const updateData = async (endpoint, data) => {
//     const response = await axios.put(`${endpoint}/${data.id}`, data);
//     return response;
// };
//
// export const addData = async (endpoint, data) => {
//     const response = await axios.post(endpoint, data);
//     return response;
// };

export default callApi;