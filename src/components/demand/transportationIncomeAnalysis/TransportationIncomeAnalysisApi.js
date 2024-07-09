import {useMutation} from "react-query";
import api from "@/common/queries/Api.js";
import {useContext} from "react";
import {loadingSpinnerContext} from "@/components/common/LoadingSpinner.jsx";

export function TransportationIncomeAnalysisApi() {
    const loadingSpinner = useContext(loadingSpinnerContext);
    const getTransportationIncomeAnalysisMutation = useMutation(
        async (data) => {
            //console.log("data", data);
            loadingSpinner.show();
            return await api.post(data, "/v1/transportation-income-analysis/search");
        },
        {
            onSuccess: (data, variables, context) => {
                //console.log("onsuccess", data, variables, context);
            },
            onSettled: () => {
                loadingSpinner.hide();
            }
        }
    );

    return {
        getTransportationIncomeAnalysisMutation
    };
}
