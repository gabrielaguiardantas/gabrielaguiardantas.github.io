import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import languageReducer from "./reducers/languageReducer";

const store = createStore(languageReducer, composeWithDevTools());

export default store;