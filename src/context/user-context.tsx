"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  use,
} from "react";

export type UserStateInterface = {
  remainingLife: number;
  correct: boolean;
  lastGuessHero: string;
  lastGuessId: number;
  lastGuessDate: string;
  lastGuessCounter: number;
  lastGuessBaseName: string;
};

type UserStateType = {
  user: UserStateInterface;
  setUser(user: UserStateInterface): void;
};

const UserContext = createContext<UserStateType | null>(null);

const useUser = (): UserStateType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Please use UserProvider in parent component");
  }

  return context;
};

const initialState: UserStateInterface = {
  remainingLife: 6,
  correct: false,
  lastGuessHero: "",
  lastGuessId: -1,
  lastGuessDate: "",
  lastGuessBaseName: "",
  lastGuessCounter: 0,
};

export const UserProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState(initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user_guess_state");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default useUser;
