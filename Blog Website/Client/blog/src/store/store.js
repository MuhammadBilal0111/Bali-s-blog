import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userSlice.reducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  // reducer: {
  //   user: userSlice.reducer,
  // },
  reducer: persistedReducer,
  // prevent error using redux toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
export default store;

// when we refresh the page the state return to the old state in redux toolkit
