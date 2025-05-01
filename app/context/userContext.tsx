"use client";
import { ChildProcess } from "child_process";
import { useContext, useEffect, createContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Amplify } from "aws-amplify";
import awsExports from "../awsExports";
import { getCurrentUser, signIn } from "@aws-amplify/auth";

type UserContextType = ReturnType<typeof useAuth>;

const UserContext = createContext<UserContextType | null>(null);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  useEffect(() => {
    Amplify.configure(awsExports); // ✅ only runs once on mount

    //Try to get a user initially
    try {
      (async () => {
        const user = await getCurrentUser();
        auth.setCurrentUser(user);
        auth.setIsLoggedIn(true);
      })();
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUserContext must be used within a UserContextProvider");
  return ctx;
};

export { UserContextProvider, useUserContext };
