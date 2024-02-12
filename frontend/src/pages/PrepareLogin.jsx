import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "../features/auth/authSlice";

const PrepareLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInLocalStorage = localStorage.getItem("user");

  useEffect(() => {
    dispatch(googleLogin());

    if (userInLocalStorage) {
      navigate("/");
    }
  }, [userInLocalStorage, dispatch, navigate]);
  return <div>PrepareLogin</div>;
};

export default PrepareLogin;
