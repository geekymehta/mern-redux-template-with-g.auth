import axios from "axios";

const API_URL = "/api/auth/";

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    const token = response.data.token;
    const item = {
      user: token,
      expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    };
    localStorage.setItem("user", JSON.stringify(item));

    // import Cookies from "js-cookie";
    // Cookies.set("user", JSON.stringify(response.data), {
    //   expires: 7,
    //   path: "/",
    // });
    // const user = JSON.parse(Cookies.get("user"));
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    const token = response.data.token;
    const item = {
      user: token,
      expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    };
    localStorage.setItem("user", JSON.stringify(item));

    // import Cookies from "js-cookie";
    // Cookies.set("user", JSON.stringify(response.data), {
    //   expires: 7,
    //   path: "/",
    // });
    // const user = JSON.parse(Cookies.get("user"));
  }

  return response.data;
};

const logout = async () => {
  localStorage.removeItem("user");
  // import Cookies from "js-cookie";
  // Cookies.remove("user");
  // const user = Cookies.get("user");
};

const authService = {
  register,
  login,
  logout,
};
export default authService;
