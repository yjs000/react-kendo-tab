import { useMutation } from "react-query";
import api from "@/common/queries/Api.js";
import { useContext } from "react";
import {loadingSpinnerContext} from "@/common/components/LoadingSpinner.jsx";


/**
 * 사용자 API
 *
 * @author jisu
 * @since 2024-04-23<br />
 */
export function OperatorApi() {
    const loadingSpinner = useContext(loadingSpinnerContext);
    const getUserMutation = useMutation(
        async (data) => {
            // loadingSpinner.show();
            return await api.post(data, "/v1/operator/search");
        },
        {
            onSuccess: (res, data) => {
                //do...
            },
            onSettled: (data, error, variables, context) => {
                //do...
                // loadingSpinner.hide();
            }
        }
    );

    const insertUserMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/operator/create");
        },
        {
            onSuccess: (res, data) => {
                //do...
            }
        }
    );

    const updateUserMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/operator/modify");
        },
        {
            onSuccess: (res, data) => {
                //do...
            }
        }
    );

    const deleteUserMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/operator/delete");
        },
        {
            onSuccess: (res, data) => {
                //do...
            }
        }
    );

    const passwordResetMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/operator/password-reset/modify");
        },
        {
            onSuccess: (res, data) => {
                //do...
            }
        }
    );

    return {
        getUserMutation,
        insertUserMutation,
        updateUserMutation,
        deleteUserMutation,
        passwordResetMutation
    };
}
