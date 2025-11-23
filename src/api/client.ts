// src/api/client.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

let authToken: string | null = null;

/**
 * Salva o token em memória e (se possível) no SecureStore.
 */
export async function setAuthToken(token: string) {
  authToken = token;

  // só salva no SecureStore se NÃO estiver rodando no Expo Go
  if (Constants.executionEnvironment !== "storeClient") {
    try {
      await SecureStore.setItemAsync("jwt", token);
    } catch (e) {
      console.warn("SecureStore indisponível, usando memória.");
    }
  }
}

/**
 * Carrega o token do SecureStore ao iniciar o app.
 */
export async function loadStoredToken() {
  try {
    const stored = await SecureStore.getItemAsync("jwt");
    if (stored) authToken = stored;
  } catch (e) {
    console.warn("SecureStore não disponível, continuando sem persistência.");
  }
}

/**
 * Axios instance
 */
export const api = axios.create({
  baseURL: "https://api-sankhya-fila-conferencia-6bbe82fb50b8.herokuapp.com/",
  timeout: 10000,
});

/**
 * Interceptor síncrono — usa token que está em memória
 */
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
