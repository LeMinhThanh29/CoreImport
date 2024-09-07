import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slice/LoginSlice";
import ProgramSlice from "./slice/ProgramSlice";
import ConfigSice from "./slice/ConfigSice";
import CompanySlice from "./slice/CompanySlice";
import Department from "./slice/Department";
import AuthoritySlice from "./slice/AuthoritySlice";
import UserManagerSlice from "./slice/UserManagerSlice";
import ImportFileSlice from "./slice/ImportFileSlice";
import HomeStatusSlice from "./slice/HomeStatusSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
//import các phần tử của persist
import storage from "redux-persist/lib/storage";

//cấu hình persist
const persistConfig = {
  key: "root",
  storage,
};
//tạo ra persistReducer chỉ áp dụng cho login
const persistReducers = persistReducer(persistConfig, LoginSlice);

export default configureStore({
  reducer: {
    login: persistReducers,
    program: ProgramSlice,
    config: ConfigSice,
    company: CompanySlice,
    department: Department,
    author: AuthoritySlice,
    user: UserManagerSlice,
    import: ImportFileSlice,
    home: HomeStatusSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
