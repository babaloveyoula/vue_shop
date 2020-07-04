import axios from "axios";
import { showLoading, hideLoading } from "../untils/loadind";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

import { Notification } from "element-ui";
const BASE_URL = "http://timemeetyou.com:8889/api/private/v1/";
// axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"
// // http://timemeetyou.com:8889/api/private/v1/
// // https://www.liulongbin.top:8888/api/private/v1/

const Service = axios.create({
  timeout: 3000,
  baseURL: BASE_URL
});
Service.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    Nprogress.start();
    showLoading();
    return config;
  },
  err => Promise.reject(err)
);
Service.interceptors.response.use(
  response => {
    Nprogress.done();
    hideLoading();
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  err => {
    if (err.message.includes("Network Error")) {
      Notification({
        title: "没网了",
        message: "应该是网断了",
        type: "error"
      });
    }
    return Promise.reject(err);
  }
);
export default Service;
