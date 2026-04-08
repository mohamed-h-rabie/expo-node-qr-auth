import axios from "axios";

// Use your machine's local IP address for both Android and iOS physical devices.
// For Android emulator, you can also use 10.0.2.2
export const BASE_IP = "192.168.1.8"; 
export const BASE_URL = `http://${BASE_IP}:3000/api`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default apiClient;
