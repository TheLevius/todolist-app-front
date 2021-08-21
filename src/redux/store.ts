import {combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {authReducer} from './auth-reducer';
import {taskReducer} from './task-reducer';
import {todolistReducer} from './todolist-reducer';
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "./app-reducer";

let rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    todolist: todolistReducer,
    tasks: taskReducer
})

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})
//export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


//@ts-ignore
window.__store__ = store;
export default store;