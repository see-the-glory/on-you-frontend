import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import App from "./App";

//백그라운드에서 푸시를 받으면 호출됨
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

//알림창을 클릭한 경우 호출됨
messaging().onNotificationOpenedApp((remoteMessage) => {
  console.log("Notification caused app to open from background state:", remoteMessage.notification);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log(type);
  console.log(detail);
  // Remove the notification
  if (notification?.id) await notifee.cancelNotification(notification.id);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
