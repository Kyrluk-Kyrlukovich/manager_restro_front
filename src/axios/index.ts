import axios from "axios";

axios.defaults.withCredentials = true;
export const apiInstance = axios.create({
	baseURL: "https://api.diplom-vasilev.ru/api",
});

apiInstance.defaults.withCredentials = true;
// apiInstance.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
