import axiosInstance from "./axios";

const chatApi = {
  // Get all chat threads for current user/provider
  getThreads: async () => {
    const res = await axiosInstance.get("/chat/threads");
    return res.data;
  },

  // Create or retrieve an existing chat thread
  createThread: async (payload) => {
    const res = await axiosInstance.post("/chat/threads", payload);
    return res.data;
  },

  // Get a single thread (with messages)
  getThread: async (threadId) => {
    const res = await axiosInstance.get(`/chat/threads/${threadId}`);
    return res.data;
  },

  // Send a text message
  sendMessage: async (threadId, content) => {
    const res = await axiosInstance.post(`/chat/threads/${threadId}/messages`, { content });
    return res.data;
  },

  // Upload a file / image message
  uploadFile: async (threadId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post(`/chat/threads/${threadId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Mark messages as read
  markRead: async (threadId) => {
    const res = await axiosInstance.patch(`/chat/threads/${threadId}/read`);
    return res.data;
  },

  // Search approved providers by name / category / area (for New Conversation modal)
  searchProviders: async (q = "") => {
    const res = await axiosInstance.get(
      `/providers/search?q=${encodeURIComponent(q)}`
    );
    return res.data;
  },
};

export default chatApi;
