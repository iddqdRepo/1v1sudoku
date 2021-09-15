import * as api from "../api"; //we import everything from action as api

//ActionCreators are functions that return actions
//thunk allows us to add additional arrow function in here (async (dispatch))

export const getEasy = () => async (dispatch) => {
  //this is successfully using redux to pass/dispatch an action from our backend
  try {
    //first we're getting a response from the api, in the response we always have the data
    const { data } = await api.fetchEasyBoard(); //data = the posts from the server returned from axios.get in the api = all the posts from the localhost 5000 server

    dispatch({ type: "FETCH_EASY", payload: data });
  } catch (error) {
    console.log(error.message + " (in actions/posts.js)");
  }
};

export const getMedium = () => async (dispatch) => {
  //this is successfully using redux to pass/dispatch an action from our backend
  try {
    //first we're getting a response from the api, in the response we always have the data
    const { data } = await api.fetchMediumBoard(); //data = the posts from the server returned from axios.get in the api = all the posts from the localhost 5000 server

    dispatch({ type: "FETCH_MEDIUM", payload: data });
  } catch (error) {
    console.log(error.message + " (in actions/posts.js)");
  }
};
