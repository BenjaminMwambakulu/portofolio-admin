import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaInfo } from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import { GrProjects } from "react-icons/gr";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineContactMail, MdMessage } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUserScreen } from "react-icons/tb";
import { useAuth } from "../Context/AuthContext";
import Logo from "../Components/Logo";

function DashboardLayout() {
  const Links = [
    { name: "Dashboard", to: "/", icon: TbLayoutDashboardFilled },
    { name: "Hero Section", to: "/hero", icon: TbUserScreen },
    { name: "About", to: "/about", icon: FaInfo },
    { name: "Skills and Tools", to: "/skills", icon: BsTools },
    { name: "Projects", to: "/projects", icon: GrProjects },
    { name: "Resume", to: "/resume", icon: IoDocumentTextOutline },
    { name: "Contact", to: "/contact", icon: MdOutlineContactMail },
    { name: "Messages", to: "/messages", icon: MdMessage },
    { name: "Settings", to: "/settings", icon: IoSettingsOutline },
  ];
  const location = useLocation();

  const auth = useAuth();

  // Check if auth context is loaded and user is authenticated
  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  return (
    <div className="max-w-screen max-h-screen bg-gray-100 flex gap-8">
      <aside className="w-62.5 max-h-screen bg-white text-gray-700 p-4">
        <Logo />
        <nav className="mt-10">
          <ul>
            {Links.map((link) => (
              <li
                key={link.to}
                className={
                  `mt-3 hover:bg-gray-200 p-2 rounded` +
                  (location.pathname === link.to
                    ? " font-semibold text-gray-900 bg-gray-300 p-2 rounded"
                    : "")
                }
              >
                {link.icon && <link.icon className="inline mr-2" size={24} />}
                <Link to={link.to} className="hover:text-gray-900">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
