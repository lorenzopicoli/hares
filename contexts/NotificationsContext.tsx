import { createContext, useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";
import * as Notifications from "expo-notifications";
import { handleBackgroundExport } from "@/hooks/useScheduledExport";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

type NotificationsContext = {};

export const NotificationsContext = createContext<NotificationsContext | null>(null);

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const lastNotification = Notifications.useLastNotificationResponse();
  const responseListener = useRef<Notifications.EventSubscription>();
  const [handledInitialNotification, setHandledInitialNotification] = useState(false);
  const router = useRouter();

  const handleNewNotificationAction = useCallback(
    async (notification: Notifications.NotificationResponse) => {
      try {
        const data = notification.notification.request.content?.data;
        switch (data?.type) {
          case "export": {
            const destinationFolder = await handleBackgroundExport();
            Toast.show({
              type: "success",
              text1: "Database backup completed successfully",
              text2: destinationFolder,
              position: "bottom",
            });
            break;
          }

          case "tracker":
            router.navigate({ pathname: "/entry/addEntry", params: { trackerId: data.trackerId } });
            break;

          default:
            break;
        }
      } catch (e) {
        console.log(e);
        alert("Failed to handle notification");
      }

      await Notifications.clearLastNotificationResponseAsync();
    },
    [router.navigate],
  );

  useEffect(() => {
    if (lastNotification && !handledInitialNotification) {
      handleNewNotificationAction(lastNotification);
    }

    if (lastNotification !== undefined) {
      setHandledInitialNotification(true);
    }
  }, [lastNotification, handledInitialNotification, handleNewNotificationAction]);

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNewNotificationAction(response);
    });

    return () => {
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [handleNewNotificationAction]);

  return <NotificationsContext.Provider value={{}}>{children}</NotificationsContext.Provider>;
};
