import React from "react";

export default React.createContext({
  userId: null,
  token: null,
  isTeacher: true,
  login: () => {},
  logout: () => {}
});