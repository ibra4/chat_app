import { combineReducers, createStore } from 'redux'
import AppReducer from './src/reduers/AppReducer'
import UserReducer from './src/reduers/UserReducer'


const reducers = combineReducers({
    app: AppReducer,
    user: UserReducer
})

export const store = createStore(reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())