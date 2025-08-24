import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import TreatmentServices from '../pages/TreatmentServices';
import Location from '../pages/Location';
import AppointmentDate from '../pages/AppointmentDate';
import UserDetails from '../pages/UserDetails';
import BookingSummary from '../pages/BookingSummary';
import BookingComfirmation from '../pages/BookingComfirmation';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Location /> },
      { path: 'service', element: <TreatmentServices />},
      { path: 'date', element: <AppointmentDate />},
      { path: 'details', element: <UserDetails/>},
      { path: 'booking', element: <BookingSummary/>},
      { path: 'confirmation', element: <BookingComfirmation />}
    ],
  },
];

const appRouter = createBrowserRouter(routes)
export default appRouter;
