import { Outlet } from 'react-router-dom';
import AppHeader from './components/AppHeader'
import { StepperProvider } from './store/StepperContext'

function App() {
  const steps = ['Location', 'Service', 'Date', 'Details'];
  return (
    <StepperProvider totalSteps={steps.length} persistKey="booking-step">
      <AppHeader />
      <Outlet />
    </StepperProvider>
  )
}

export default App
