

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { socket } from "./socket"; // make sure this exists and exports the socket instance

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Run authentication check once
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Connect socket and handle online users
  useEffect(() => {
    if (authUser) {
      // Send userId when connecting
      socket.io.opts.query = {
        userId: authUser._id,
      };
      socket.connect();

      // Listen for online users from backend
      socket.on("getOnlineUsers", (onlineUserIds) => {
        useAuthStore.getState().setOnlineUsers(onlineUserIds);
      });

      return () => {
        socket.disconnect();
        socket.off("getOnlineUsers");
      };
    }
  }, [authUser]);

  // Show loader while checking auth
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
