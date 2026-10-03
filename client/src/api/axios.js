import axios from 'axios';

// Cookie JWT httpOnly được trình duyệt tự gửi kèm nhờ withCredentials.
const api = axios.create({ baseURL: '/api', withCredentials: true });

export const errorMessage = (err, fallback = 'Có lỗi xảy ra, thử lại nhé.') =>
  err?.response?.data?.message || fallback;

export default api;
