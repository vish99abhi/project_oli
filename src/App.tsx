import { Outlet } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import { StepperProvider } from "./store/StepperContext";
import UserContextProvider from "./store/UserContext";
import bg from "./assets/oli-bg.jpg";
import { useMediaQuery, useTheme, Box } from "@mui/material";

function MobileComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingBottom: isMobile ? "180px" : 0,
      }}
    >
      <Box>
        <Box style={{ backgroundColor: "whitesmoke" }}>
          <AppHeader />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const steps = ["Location", "Service", "Date", "Details"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <UserContextProvider>
      <StepperProvider totalSteps={steps.length} persistKey="booking-step">
        {isMobile ? (
          <MobileComponent />
        ) : (
          <div className="relative ">
            <div
              className="grid grid-cols-12 "
              style={{ backgroundColor: "whitesmoke" }}
            >
              <div className="col-span-7">
                <AppHeader />
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-5">
                <Outlet />
              </div>
              <div className="col-span-2"></div>
              <div className="col-span-5 relative h-[calc(100vh-200px)]">
                <div className="bg-white border border-gray-200  shadow-md p-6 max-w-xs absolute z-20 bottom-0 -left-60 rounded-tr-[40px]">
                  <h3 className="text-2xl font-bold text-[#6B3F1F]">50,000+</h3>
                  <p className="text-sm text-[#6B3F1F] mt-2 leading-relaxed">
                    customers transformed their skin, right from the privacy of
                    their home
                  </p>
                </div>
              </div>
              <img
                src={bg}
                alt="background"
                className="w-[50%] h-screen object-cover rounded-tl-[400px] absolute top-0 right-0"
              />
            </div>
          </div>
        )}
      </StepperProvider>
    </UserContextProvider>
  );
}

export default App;
