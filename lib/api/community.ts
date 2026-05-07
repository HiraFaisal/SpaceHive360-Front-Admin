import api from "./axios";

export const communityApi = {
  getPosts: (tag?: string) => api.get("/api/Community/posts", { params: { tag } }),
  createPost: (data: FormData) => api.post("/api/Community/posts", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  likePost: (postId: string) => api.post(`/api/Community/posts/${postId}/like`),
  getComments: (postId: string) => api.get(`/api/Community/posts/${postId}/comments`),
  addComment: (data: any) => api.post("/api/Community/comments", data),
  getStats: () => api.get("/api/Community/stats"),
  getActiveMembers: () => api.get("/api/Community/active-members"),
  getEvents: () => api.get("/api/Community/events"),
  createEvent: (data: any) => api.post("/api/Community/events", data),
};
