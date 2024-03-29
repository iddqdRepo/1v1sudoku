import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"; //keeps track of store (global state) and allows us access from anywhere inside the app
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";
import App from "./App";


const store = createStore(reducers, compose(applyMiddleware(thunk)));
store.subscribe(() => {
  // console.log("store changed", store.getState());
});
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
