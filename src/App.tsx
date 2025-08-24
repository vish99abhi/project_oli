import { Outlet } from 'react-router-dom';
import AppHeader from './components/AppHeader'
import { StepperProvider } from './store/StepperContext'
import UserContextProvider from './store/UserContext';

function App() {
  const steps = ['Location', 'Service', 'Date', 'Details'];
  return (
    <UserContextProvider>
      <StepperProvider totalSteps={steps.length} persistKey="booking-step">
        <AppHeader />
        <Outlet />
      </StepperProvider>
    </UserContextProvider>
  )
}

export default App
