import React from "react";

export default React.createContext({
  userID: null,
  token: null,
  login: () => {},
  logout: () => {}
});