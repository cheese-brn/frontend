const SET_QUERY = 'set-query';

const APP_ACTIONS = {
  SET_QUERY,
  SET_QUERY_ACTION: (query) => {return({type: SET_QUERY, payload: query});}
};

export default APP_ACTIONS;