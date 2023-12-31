import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { SETUSER, LOGIN, LOGOUT, ADMINLOGIN, ADMINLOGOUT, ALLUSERS, UPDATEUSER } from './ActionType';

const persistConfig = {
    key: 'root',
    storage,
};

const initialState = {
    // users: {},
    users: {},
    token: '',
    // profile:'',
    allUsers: [],
    admintoken: '',


    data:0,

}


const reducer = (state = initialState, action) => {

    switch (action.type) {

        case SETUSER:

            return {

                ...state,
                users: action.users,

            }

        case LOGIN:
            return {
                ...state,
                token: action.token,


            }


        case LOGOUT:
            return {
                ...state,
                user: null,

            }

        case ALLUSERS:
            return {
                ...state,
                allUsers: action.data
            }

        case UPDATEUSER:
            const updatedUser = action.data
            const updatedUsers = state.allUsers.map((user) => {
                if (user.id === updatedUser.id) {
                    return updatedUser
                } else {
                    return user
                }
            })
            return {
                ...state,
                allUsers: updatedUsers
            }

        case ADMINLOGIN:
            return {
                ...state,
                admintoken: action.token,


            }
        case ADMINLOGOUT:
            return {
                ...state,
                admintoken:'',
                allUsers:[],


            }

        default:
            return state
    }
}

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };