const initialAuthState = {
  authToken: null,
};

const initialUserState = {
  user: null,
};

export const AuthReducers = (state = initialAuthState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authToken: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialAuthState,
      };
    default:
      return state;
  }
};

export const UserReducers = (state = initialUserState, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "DELETE_USER":
      return {
        ...initialUserState,
      };
    default:
      return state;
  }
};
