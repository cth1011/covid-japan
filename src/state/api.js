import axios from "axios";

const apiUrl = "https://localhost:8080/";

export default axios.create({
  baseURL: `${apiUrl}`,
  withCredentials: false,
});
