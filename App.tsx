import React, { useEffect } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import * as Notifications from "expo-notifications";

import { loadStoredToken } from "./src/api/client";

// Configuração para notificações locais
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {

  // Carrega o JWT que estava salvo no SecureStore
  useEffect(() => {
    loadStoredToken();
  }, []);

  return <RootNavigator />;
}
