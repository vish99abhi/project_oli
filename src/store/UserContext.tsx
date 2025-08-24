import { createContext, useContext, useState } from "react";

type UserDetailsType = {
  address?: string;
  name?: string;
  email?: string;
  phone?: string;
  saveInfo?: boolean;
};

type UserContextType = {
  userDetails: UserDetailsType;
  setBookingDetails: (details: Object[]) => void;
  bookingDetails: Object[];
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsType>>;
};

const UserDetails = createContext<UserContextType | undefined>(undefined);

export const useUserDetails = () => {
  const context = useContext(UserDetails);
  if (context === undefined) {
    throw new Error("useUserDetails must be used within a UserContextProvider");
  }
  return context;
};

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetailsType>({});
  const [bookingDetails, setBookingDetails] = useState<Object[]>([]);
  return (
    <UserDetails.Provider
      value={{ setUserDetails, userDetails, bookingDetails, setBookingDetails }}
    >
      {children}
    </UserDetails.Provider>
  );
}

export default UserContextProvider;
