import axios from "axios";
// Creating axios instance
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
	headers: {
		"Content-type": "application/json",
		Accept: "application/json",
	},
});

// list of all the endpoints
export const sendOtp = (data) => api.post("/api/send-otp", data);
export const verifyOtp = (data) => api.post("/api/verify-otp", data);
export const activate = (data) => api.post("/api/activate", data);
export const logout = () => api.post("/api/logout");
export const createRoom = (data) => api.post("/api/rooms");

// interceptors
api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		//storing the first req that we need to repeat after refresh token
		const originalRequest = error.config;
		//to prevent infinte loop if refresh token is also expired we used isRetry for single 401
		if (
			error.response.status === 401 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				await axios.get(
					`${process.env.REACT_APP_API_URL}/api/refresh`,
					{
						withCredentials: true,
					}
				);
				//requesting original request again, repeating request again that is failed previously
				return api.request(originalRequest);
			} catch (error) {
				console.log(error.message);
			}
		}
		//if someelse request failed
		throw error;
	}
);

export default api;
