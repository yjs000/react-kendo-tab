import { useMutation } from "react-query";
import api from "@/common/queries/Api.js";

export function AuthApi() {
    const getAuthMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/authority/search");
        },
        {
            onSuccess: (res, req) => {
                //do...
            }
        }
    );

    return {
        getAuthMutation
    };
}
