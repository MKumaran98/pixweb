import {
  useReducer,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  authReducer,
  signUpUser,
  signInUser,
  onReload,
  signOutUser,
  changePassword,
  signInGuest,
} from "./authReducer";
import { setupAuthHeaderForServiceCalls } from "../../axiosUtils";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("SIGNIN_PAGE");
  const token = localStorage.getItem("token");
  setupAuthHeaderForServiceCalls(token);

  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    userName: null,
    expiresIn: null,
    userId: null,
  });

  useEffect(() => {
    onReload({ dispatch });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId: state.userId,
        token: state.token,
        userName: state.userName,
        expiresIn: state.expiresIn,
        authDispatch: dispatch,
        signUpUser: signUpUser,
        signInUser: signInUser,
        signOutUser: signOutUser,
        currentPage: currentPage,
        changePassword: changePassword,
        signInGuest: signInGuest,
        setAuthCurrentPage: setCurrentPage,
        authLoading: loading,
        setAuthLoading: setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
