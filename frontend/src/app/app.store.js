import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js"
import {useSelector,useDispatch} from "react-redux";
export const store = configureStore({
    reducer:{
        auth:authReducer,
        
    }
})