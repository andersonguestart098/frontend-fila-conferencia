// src/storage/authToken.ts
import * as SecureStore from "expo-secure-store";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync("jwt", token);
}

export async function getToken() {
  return SecureStore.getItemAsync("jwt");
}
