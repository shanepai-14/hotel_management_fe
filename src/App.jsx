import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import router from './router';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;