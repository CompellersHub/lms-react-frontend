import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { Settings, User, Mail, Shield } from "lucide-react";

function AdminSettings() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and profile
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {user?.username || "Anonymous User"}
                </h3>
                <p className="text-sm text-gray-600">
                  {user?.role || "BLOGGER"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    {user?.email || "No email provided"}
                  </p>
                </div>
              </div>
              {user?.first_name && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      First Name
                    </p>
                    <p className="text-sm text-gray-600">{user.first_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {user?.id || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {user?.role || "BLOGGER"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Account Status
                </label>
                <p className="mt-1 text-sm text-green-800 bg-green-50 p-2 rounded">
                  Active
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Login
                </label>
                <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
