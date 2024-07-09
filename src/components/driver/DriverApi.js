import { useMutation } from "react-query";
import api from "@/common/queries/Api.js";
import { useContext } from "react";
import {loadingSpinnerContext} from "@/common/components/LoadingSpinner.jsx";

export const DriverApi = () => {
    const loadingSpinner = useContext(loadingSpinnerContext);
    const getDriverMutation = useMutation(
        async (data) => {
            loadingSpinner.show();
            return await api.post(data, "/v1/driver/search");
        },
        {
            onSuccess: (res, req) => {
                //do...
            },
            onSettled: () => {
                loadingSpinner.hide();
            }
        }
    );

    const updateDriverMutation = useMutation(
        async (data) => {
            return await api.form(data, "/v1/driver/modify");
        },
        {
            onSuccess: (res, req) => {
                //do...
            }
        }
    );

    const insertDriverMutation = useMutation(
        async (data) => {
            return await api.form(data, "/v1/driver/create");
        },
        {
            onSuccess: (res, req) => {
                //do...
            }
        }
    );

    const deleteDriverMutation = useMutation(
        async (data) => {
            return await api.post(data, "/v1/driver/delete");
        },
        {
            onSuccess: (res, req) => {
                //do...
            }
        }
    );

    const getDriverSummary = useMutation(
        async (data) => {
            return await api.post(data, "/v1/driver/summary/search");
        },
        {
            onSuccess: (res, req) => {
                //do...
            }
        }
    );

    return { getDriverMutation, insertDriverMutation, updateDriverMutation, deleteDriverMutation, getDriverSummary };
};
