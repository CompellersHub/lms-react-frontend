import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import {
  Settings,
  User,
  Mail,
  Shield,
  Palette,
  Globe,
  Bell,
  Activity,
  Save,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

function AdminSettings() {
  const user = useSelector(selectCurrentUser);
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    notifications: true,
    compactView: false,
  });

  // Load preferences from localStorage
  useEffect(() => {
    const storedPrefs = localStorage.getItem("adminPreferences");
    if (storedPrefs) {
      try {
        setPreferences(JSON.parse(storedPrefs));
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = () => {
    localStorage.setItem("adminPreferences", JSON.stringify(preferences));
    // You could add a toast notification here
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Preferences
              </h2>
            </div>
            <button
              onClick={savePreferences}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Palette className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Theme
              </label>
              <div className="flex gap-3">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updatePreference("theme", value)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      preferences.theme === value
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => updatePreference("language", e.target.value)}
                className="block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Notifications
                  </label>
                  <p className="text-sm text-gray-600">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  onClick={() =>
                    updatePreference(
                      "notifications",
                      !preferences.notifications
                    )
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    preferences.notifications ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.notifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Compact View */}
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Compact View
                  </label>
                  <p className="text-sm text-gray-600">
                    Use a more compact layout for the dashboard
                  </p>
                </div>
                <button
                  onClick={() =>
                    updatePreference("compactView", !preferences.compactView)
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    preferences.compactView ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.compactView
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
