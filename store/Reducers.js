const initialState = {
  authToken:
   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLsnqXspIDsmqkiLCJzb2NpYWxJZCI6IjIxOTAwMzc4NTAiLCJpZCI6NCwiZXhwIjoxMDAwMDAxNjU0NjA3MDA4fQ.m8OBIZEcB5dZ339YvhnWgJIRatKoF-DVPk2RrbXirsQRnYdFaALwnjR4oNmHGE-OZDfhDfOITaYzWLqYnU2vcQ",
  //
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
