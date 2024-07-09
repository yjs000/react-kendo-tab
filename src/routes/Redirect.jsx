import {Navigate} from "react-router";

const Redirect = () => {
    const auth = true;
    // const {auth} = useAuth();
    if(auth) {
        return <Navigate replace to="/main"/>
    } else {
        return <Navigate replace to="/login"/>
    }
};

export default Redirect;
