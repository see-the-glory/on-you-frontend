const initialState = {
  authToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLsp4Tqt5wiLCJzb2NpYWxJZCI6IjIyMzY5ODEwNTciLCJpZCI6MywiZXhwIjoxMDAwMDAxNjU4NzIwMTAxfQ.5smwIUT3oWGro4ePbVg_7DHxYF74CP0HvWmfQG68tf_wRjwJBnh_S51PaGE2gGvZ3LL75wCXogwLVr4CH6KYVA",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authToken: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
