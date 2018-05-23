import { USER_LOGGED_IN, USER_SIGNUP, USER_LOGOUT } from '../types';
import api from '../api';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userSignup = user => ({
  type: USER_SIGNUP,
  user
});

export const userLogout = () => ({
  type: USER_LOGOUT,
  user: {}
});

export const login = credentials => dispatch =>
  api.user.login(credentials).then(token => {
    localStorage.bookwormJWT = token;
    var user = { token, isAuthenticated: true };
    dispatch(userLoggedIn(user));
  });

export const signup = userForm => dispatch =>
  api.user.signup(userForm).then(user => {
    //localStorage.bookwormJWT = user.token;
    dispatch(userSignup(user));
  });

export const logout = () => dispatch => {
  localStorage.removeItem('bookwormJWT');
  dispatch(userLogout());
};
