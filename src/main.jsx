import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ModalProvider from "@/common/components/Modal.jsx";
import store from "@/common/redux/store/Store.jsx";
import {Provider} from "react-redux";
import LoadingProvider from "@/common/components/LoadingSpinner.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <LoadingProvider>
            <QueryClientProvider client={queryClient}>
                <ModalProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ModalProvider>
            </QueryClientProvider>
            </LoadingProvider>
        </Provider>
    </React.StrictMode>
);
