import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import defaultSettingsSlice from './defaultSettingsSlice';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
};

// const rootReducer = combineReducers({
//     defaultSettings: defaultSettingsSlice.reducer,
// });

const persistedReducer = persistReducer(persistConfig, defaultSettingsSlice.reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);

export default store;
