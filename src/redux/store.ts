import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from './app-reducer';
import {authReducer} from './auth-reducer';
import {todolistReducer} from './todolist-reducer';

let rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    todolist: todolistReducer
})

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


//@ts-ignore
window.__store__ = store;
export default store;