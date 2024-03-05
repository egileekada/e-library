import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import DashboardPage from './pages/dashboard';
import DashboardLayout from './components/shared_components/dashboard_layout';
import Elibrary from './pages/e_library';
import LoginPage from './pages/login';
import UserPage from './pages/user';
import UserInfo from './pages/user_info';
import InventoryPage from './pages/inventory';
import GadgetsPage from './pages/gadgets';
import EquipmentPage from './pages/equipment';
import AdminPage from './pages/personnel';
import LibraryPage from './pages/library';
import LibraryInfo from './pages/library_info';

function App() {

  const router = createBrowserRouter(

    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardLayout />} >
          <Route path='/dashboard/home' element={<DashboardPage />} />
          <Route path='/dashboard/elibrary' element={<Elibrary />} />
          <Route path='/dashboard/library' element={<LibraryPage />} />
          <Route path='/dashboard/user' element={<UserPage />} />
          <Route path='/dashboard/personnel' element={<AdminPage />} />
          <Route path='/dashboard/inventory' element={<InventoryPage />} />
          <Route path='/dashboard/inventory/gadgets' element={<GadgetsPage />} />
          <Route path='/dashboard/inventory/equipments' element={<EquipmentPage />} />
          <Route path='/dashboard/user/info' element={<UserInfo />} />
          <Route path='/dashboard/library/info' element={<LibraryInfo />} />
        </Route>
      </Route>
    )
  );
  return (
    <RouterProvider router={router} />
  )
}

export default App
