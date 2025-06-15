import { Routes, Route } from "react-router-dom";
import ProtectedRoute from '../ProtectedRoute';
import Cookies from 'js-cookie'; // Import js-cookie
import Axios from 'axios'; // Import axios for API request

import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

export function Dashboard() {
  const [role, setRole] = useState(null); // State to store user role
  const [loading, setLoading] = useState(true); // State to manage loading state

  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Axios.get("http://localhost:9004/api/user", { withCredentials: true });
        const { role } = response.data;
        setRole(role);
        // console.log(role)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  if (loading) {
    return <div>Loading...1</div>;
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} brandImg={sidenavType === "blue" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}/>

      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        <Routes>
          {routes.map(({ layout, pages }) =>
            layout === 'dashboard' &&
            pages.map(({ path, element, allowedRoles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute
                    element={element}
                    allowedRoles={allowedRoles}
                    userRole={role} // Pass the userRole here
                  />
                }
              />
            ))
          )}
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
        
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
