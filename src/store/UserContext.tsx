import { createContext, useContext, useState } from "react";

type UserDetailsType = {
  address?: string;
  name?: string;
  email?: string;
  phone?: string;
  saveInfo?: boolean;
};

type UserContextType = {
  guestDetails: any;
  setGuestDetails: React.Dispatch<React.SetStateAction<any>>;
  userDetails: UserDetailsType;
  setBookingDetails: (details: Object[]) => void;
  bookingDetails: any;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsType>>;
  setSelectedServices: React.Dispatch<React.SetStateAction<any>>;
  selectedServices: any[];
  centerDetails: any;
  setCenterDetails: React.Dispatch<React.SetStateAction<any>>;
  setSlotTime: React.Dispatch<React.SetStateAction<any>>;
  soltTime: any;
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
  const [userDetails, setUserDetails] = useState<any>(null);
  const [guestDetails, setGuestDetails] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [centerDetails, setCenterDetails] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [soltTime, setSlotTime] = useState<any>(null);

  return (
    <UserDetails.Provider
      value={{
        guestDetails,
        setGuestDetails,
        setUserDetails,
        userDetails,
        bookingDetails,
        setBookingDetails,
        setSelectedServices,
        selectedServices,
        centerDetails,
        setCenterDetails,
        soltTime,
        setSlotTime,
      }}
    >
      {children}
    </UserDetails.Provider>
  );
}

export default UserContextProvider;
