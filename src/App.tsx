import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import DashboardPage from './pages/dashboard';
import DashboardLayout from './components/shared_components/dashboard_layout';
import Elibrary from './pages/e_library';
import LoginPage from './pages/login';

function App() {

  const router = createBrowserRouter(

    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardLayout />} >
          <Route index element={<DashboardPage />} />
          <Route path='/dashboard/elibrary' element={<Elibrary />} />
        </Route>
      </Route>
    )
  );
  return (
    <RouterProvider router={router} />
  )
}

export default App
