const initialAuthState = {
  authToken: null,
};

const initialUserState = {
  user: null,
};

const initialClubState = {
  club: null,
  homeScrollY: 0,
  scheduleScrollX: 0,
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

export const ClubReducers = (state = initialClubState, action) => {
  switch (action.type) {
    case "UPDATE_CLUBHOME_SCROLL_Y":
      return {
        ...state,
        homeScrollY: action.payload,
      };
    case "UPDATE_CLUBHOME_SCHEDULE_SCROLL_X":
      return {
        ...state,
        scheduleScrollX: action.payload,
      };
    case "DELETE_CLUB":
      return {
        ...initialClubState,
      };
    default:
      return state;
  }
};
