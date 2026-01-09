import axios from "axios";

const API_BASE_URL = "https://stageapi.monkcommerce.app/task";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_MONK_API_KEY,
  },
});

export const productsApi = {
  /**
   * @param {string} search
   * @param {number} page
   * @param {number} limit
   */
  search: async (search = "", page = 1, limit = 10) => {
    try {
      const response = await apiClient.get("/products/search", {
        params: { search, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

export default apiClient;
