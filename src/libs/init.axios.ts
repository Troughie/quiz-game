import { supabase } from "@/features/authentication/hooks/useAuthentication";
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (
    config: InternalAxiosRequestConfig<unknown>
  ): Promise<InternalAxiosRequestConfig<unknown>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    const { data } = response;
    return data;
  },
  function (error) {
    // unknown status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { response } = error;
    return Promise.reject(response?.data);
  }
);

const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    instance
      .request<unknown, AxiosResponse<unknown>>(conf)
      .then((res: AxiosResponse<unknown>) => {
        resolve(res as T);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: "GET" });
}

export function post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: "POST" });
}

export function patch<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: "PATCH" });
}

export function put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: "put" });
}

export function del<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: "delete" });
}

export default instance;
