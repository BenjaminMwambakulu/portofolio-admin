import React from "react";
import {
  FaUser,
  FaWallet,
  FaCheckCircle,
  FaCogs,
  FaEye,
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { getDashboardData, getRecentActivities } from "../Services/DashboardService";

function Dashboard() {
  const [dashboardData, setDashboardData] = React.useState({
    totalProjects: 0,
    totalSkills: 0,
    profileViews: 0,
  });
  const [recentActivities, setRecentActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResult, activitiesResult] = await Promise.all([
          getDashboardData(),
          getRecentActivities(),
        ]);

        if (dashboardResult.success) {
          setDashboardData(dashboardResult.data);
        }

        if (activitiesResult.success) {
          setRecentActivities(activitiesResult.data);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    // Handle Firestore Timestamp or JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const stats = [
    {
      title: "Total Balance",
      value: "K12,345",
      change: "+12.5%",
      isPositive: true,
      icon: <FaWallet className="text-blue-500" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Projects Completed",
      value: loading ? "..." : dashboardData.totalProjects.toString(),
      change: "+2 this month",
      isPositive: true,
      icon: <FaCheckCircle className="text-green-500" size={24} />,
      color: "bg-green-50",
    },
    {
      title: "Total Skills",
      value: loading ? "..." : dashboardData.totalSkills.toString(),
      change: "+3 new",
      isPositive: true,
      icon: <FaCogs className="text-purple-500" size={24} />,
      color: "bg-purple-50",
    },
    {
      title: "Profile Views",
      value: loading ? "..." : (dashboardData.profileViews || 0).toLocaleString(),
      change: "+24.7%",
      isPositive: true,
      icon: <FaEye className="text-amber-500" size={24} />,
      color: "bg-amber-50",
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "+5.2%",
      isPositive: true,
      icon: <FaChartLine className="text-emerald-500" size={24} />,
      color: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back,{" "}
            <span className="font-semibold text-blue-600">Username</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Here is a quick overview of your portfolio statistics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
            <FaUser size={18} />
          </div>
          <div>
            <p className="font-medium">Username</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium flex items-center ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? (
                  <FaArrowUp size={12} className="mr-1" />
                ) : (
                  <FaArrowDown size={12} className="mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts and Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Performance Overview
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaCalendarAlt />
              <span>Last 30 days</span>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine size={48} className="text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                Interactive Chart Area
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Monthly performance visualization
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg. Projects</p>
              <p className="text-lg font-bold text-gray-900">3.2</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-lg font-bold text-gray-900">94%</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-lg font-bold text-gray-900">2.1h</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Client Rating</p>
              <p className="text-lg font-bold text-gray-900">4.8★</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <span className="text-sm text-blue-600 font-medium">View All</span>
          </div>

          <div className="space-y-4">
            {loading ? (
               <p className="text-gray-500 text-sm">Loading activities...</p>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.activity}
                    </p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(activity.timeRaw)}</p>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-gray-500 text-sm">No recent activities.</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Quick Actions</p>
                <p className="text-sm text-gray-500">Update your profile</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
