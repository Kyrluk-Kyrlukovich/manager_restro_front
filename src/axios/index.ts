import axios from "axios";

axios.defaults.withCredentials = true;
export const apiInstance = axios.create({
	baseURL: "http://localhost:80/api/",
});

apiInstance.defaults.withCredentials = true;
// apiInstance.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
