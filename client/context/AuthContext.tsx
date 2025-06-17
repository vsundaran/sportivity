import { GetProfile } from "@/API/apiHandler";
import { isTokenValid } from "@/utils/jwt";
import { getToken, removeToken } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isFetchingProfile: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
  isLoading: true,
  isFetchingProfile: true,
});

export interface User {
  _id: string;
  email: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other"; // Adjust based on your gender enum logic
  yearOfBirth: string;
  shortBio: string;
  country: string;
  isNewUser: boolean;
  profileImage: string;
  createdAt: string; // or `Date` if you parse it
  __v: number;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    data,
    isLoading: isFetchingProfile,
    refetch,
  } = useQuery({
    queryKey: ["getProfile"],
    queryFn: GetProfile,
  });

  useEffect(() => {
    const checkAndRefetch = async () => {
      const token = await getToken();
      if (token && isTokenValid(token)) {
        console.log("refetching");
        refetch();
      }
    };
    checkAndRefetch();
  }, [isAuthenticated]);

  useEffect(() => {
    const userData = data?.user as User | null | undefined;
    console.log(userData, "userData");
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [data]);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    setIsLoading((_) => true);
    await removeToken();
    setIsAuthenticated((_) => false);
    setUser(null);
    setIsLoading((_) => false);
    router.navigate("/");
  };

  const checkToken = async () => {
    const token = await getToken();
    if (token && isTokenValid(token)) {
      setIsAuthenticated((_) => true);
    } else {
      await removeToken();
      setIsAuthenticated((_) => false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        isFetchingProfile,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
