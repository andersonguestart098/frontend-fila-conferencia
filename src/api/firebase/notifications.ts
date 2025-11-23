// src/firebase/notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Garante que é um dispositivo físico
  if (!Device.isDevice) {
    console.log("Push só funciona em dispositivo físico.");
    return null;
  }

  // Não tenta registrar se estiver rodando no Expo Go
  if (Constants.appOwnership === "expo") {
    console.log("Expo Go detectado – ignorando registro de push.");
    return null;
  }

  // Permissões
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permissão de notificação negada");
    return null;
  }

  // Canal Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Pega o projectId do app.json / eas
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("Project ID não encontrado nas configs do app.");
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  console.log("Expo push token:", token);
  return token;
}
