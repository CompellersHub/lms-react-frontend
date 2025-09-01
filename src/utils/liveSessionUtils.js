/**
 * Live Session Utilities
 * Handles detection and management of live masterclass sessions
 */

// Live session configuration - this would typically come from an API or config
export const LIVE_SESSIONS = [
  {
    id: "live-session-1",
    title: "Data Analysis Masterclass",
    startTime: "2025-08-31T18:00:00.000Z",
    endTime: "2025-08-31T19:00:00.000Z",
    zoomLink:
      "https://zoom.us/j/91481483605?pwd=1lqLsau8mD5oaqmboSUGabLW7g7KET.1",
    courseName: "Data Analysis",
    isActive: true,
  },
  // Add more live sessions as needed
];

/**
 * Check if a live session is currently active
 * @param {Object} session - Live session object
 * @returns {boolean} - True if session is currently live
 */
export const isSessionLive = (session) => {
  if (!session || !session.isActive) return false;

  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  return now >= startTime && now <= endTime;
};

/**
 * Get all currently live sessions
 * @returns {Array} - Array of live session objects
 */
export const getLiveSessions = () => {
  return LIVE_SESSIONS.filter(isSessionLive);
};

/**
 * Check if any session is currently live
 * @returns {boolean} - True if any session is live
 */
export const hasLiveSessions = () => {
  return getLiveSessions().length > 0;
};

/**
 * Get the primary live session (first one if multiple)
 * @returns {Object|null} - Live session object or null
 */
export const getPrimaryLiveSession = () => {
  const liveSessions = getLiveSessions();
  return liveSessions.length > 0 ? liveSessions[0] : null;
};

/**
 * Get the next upcoming live session
 * @returns {Object|null} - The next upcoming live session object or null
 */
export const getNextUpcomingLiveSession = () => {
  const now = new Date();
  const upcomingSessions = LIVE_SESSIONS.filter((session) => {
    const startTime = new Date(session.startTime);
    return startTime > now;
  }).sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return upcomingSessions.length > 0 ? upcomingSessions[0] : null;
};

/**
 * Format time remaining until session starts
 * @param {Object} session - Live session object
 * @returns {string} - Formatted time string
 */
export const getTimeUntilStart = (session) => {
  if (!session) return "";

  const now = new Date();
  const startTime = new Date(session.startTime);
  const diff = startTime - now;

  if (diff <= 0) return "Live Now";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `Starts in ${hours}h ${minutes % 60}m`;
  }
  return `Starts in ${minutes}m`;
};

/**
 * Format time remaining in current live session
 * @param {Object} session - Live session object
 * @returns {string} - Formatted time string
 */
export const getTimeRemaining = (session) => {
  if (!session || !isSessionLive(session)) return "";

  const now = new Date();
  const endTime = new Date(session.endTime);
  const diff = endTime - now;

  if (diff <= 0) return "Session Ended";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m remaining`;
  }
  return `${minutes}m remaining`;
};
