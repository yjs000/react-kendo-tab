import {useMutation} from "react-query";
import api from "@/common/queries/Api.js";
import {useContext} from "react";
import {loadingSpinnerContext} from "@/common/components/LoadingSpinner.jsx";

export function DemandAnalysisApi() {
    const loadingSpinner = useContext(loadingSpinnerContext);
    const getDemandAnalysisMutation = useMutation(
        async (data) => {
            loadingSpinner.show();
            return await api.post(data, "/v1/demand/search");
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
    /**
    * 행정동 별 승차/하차/환승 정보 조회 api
    **/
    const getDemandAdministrationMutation = useMutation(
        async (data) => {
            loadingSpinner.show();
            return await api.post(data, "/v1/demand-administration-statutory/search");
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

    /**
     * 정류장 별 승차/하차/환승 정보 조회 api
     **/
    const getDemandBusStopMutation = useMutation(
        async (data) => {
            loadingSpinner.show();
            return await api.post(data, "/v1/demand-bus-stop/search");
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
        getDemandAnalysisMutation,
        getDemandAdministrationMutation,
        getDemandBusStopMutation
    };
}
