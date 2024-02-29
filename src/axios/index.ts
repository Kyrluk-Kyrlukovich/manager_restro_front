import axios from "axios";

axios.defaults.withCredentials = true;
export const apiInstance = axios.create({
	baseURL: "http://94.26.225.206:81/api/",
});

apiInstance.defaults.withCredentials = true;
// apiInstance.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
