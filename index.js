import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import App from "./App";

//백그라운드에서 푸시를 받으면 호출됨
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (notification?.id) await notifee.cancelNotification(notification.id);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
