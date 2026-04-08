const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Get stored user data from localStorage
 */
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error reading user from storage:", error);
    return null;
  }
};

/**
 * Save user data to localStorage
 */
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

/**
 * Resolve user avatar URL from various sources
 */
export const resolveUserAvatar = (user) => {
  const avatarPath = user?.avatar_url || user?.avatar;

  if (avatarPath) {
    // Handle absolute URLs and data URLs
    if (/^(https?:)?\/\//i.test(avatarPath) || avatarPath.startsWith("data:")) {
      return avatarPath;
    }

    // Handle relative paths
    if (avatarPath.startsWith("/")) {
      return `${API_ORIGIN}${avatarPath}`;
    }

    return `${API_ORIGIN}/${avatarPath}`;
  }

  // Fallback: generate UI avatar
  const fallbackName = user?.name || "User";
  return `https://ui-avatars.com/api/?name=${fallbackName}&background=F97316&color=ffffff`;
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time string to readable format
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Clear all user data from storage
 */
export const clearUserData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
