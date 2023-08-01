import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{

const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
);


const login = async(inputs) =>{
    const headers = {
        "Content-Type": "application/json",
      };
    const res =   await axios.post("http://localhost:5000/api/auth/login",inputs,{ headers });
    setCurrentUser(res.data);
   
};

const logout = async (inputs) =>{   
      await axios.post("http://localhost:5000/api/auth/logout");
    setCurrentUser(null);
}


useEffect(()=>{
    localStorage.setItem("user",JSON.stringify(currentUser));
},[currentUser]);
return <AuthContext.Provider value={{currentUser,login,logout}}>{children}</AuthContext.Provider>

}