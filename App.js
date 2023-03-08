import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import Auth from "./navigation/Auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { LogBox, Platform, Text, TextInput, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import "moment/locale/ko";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store, { useAppDispatch } from "./redux/store";
import messaging from "@react-native-firebase/messaging";
import { init, updateFCMToken } from "./redux/slices/auth";
import BackgroundColor from "react-native-background-color";
import CodePush from "react-native-code-push";
import notifee, { AndroidImportance } from "@notifee/react-native";

LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const token = useSelector((state) => state.auth.token);
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useAppDispatch();

  const timezoneSetting = () => {
    moment.tz.setDefault("Asia/Seoul");
    moment.updateLocale("ko", {
      relativeTime: {
        future: "%s 후",
        past: "%s 전",
        s: "1초",
        m: "1분",
        mm: "%d분",
        h: "1시간",
        hh: "%d시간",
        d: "1일",
        dd: "%d일",
        M: "1달",
        MM: "%d달",
        y: "1년",
        yy: "%d년",
      },
    });
  };

  const fontSetting = async () => {
    await Font.loadAsync({
      "NotoSansKR-Bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
      "NotoSansKR-Regular": require("./assets/fonts/NotoSansKR-Regular.otf"),
      "NotoSansKR-Medium": require("./assets/fonts/NotoSansKR-Medium.otf"),
    });

    const texts = [Text, TextInput];
    texts.forEach((v) => {
      v.defaultProps = {
        ...(v.defaultProps || {}),
        allowFontScaling: false,
        style: {
          fontFamily: "NotoSansKR-Regular",
          lineHeight: Platform.OS === "ios" ? 19 : 21,
        },
      };
    });
  };

  const updateFCM = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log(`FCM Enabled: ${enabled}`);
    if (!enabled) {
      console.log("FCM Authorization Fail");
      return;
    }
    try {
      if (Platform.OS === "android") await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log("FCM token:", fcmToken);
      dispatch(updateFCMToken({ fcmToken }));
    } catch (e) {
      console.warn(e);
    }
  };

  const notificationChannelSetting = async () => {
    await notifee.createChannel({
      id: "club",
      name: "Club Alarms",
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: "user",
      name: "User Alarms",
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
  };

  const prepare = async () => {
    try {
      console.log(`App - Prepare!`);
      await dispatch(init());
      await fontSetting();
      timezoneSetting();
      updateFCM();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  };

  useEffect(() => {
    prepare();
    if (Platform.OS === "android") {
      notificationChannelSetting();
      BackgroundColor.setColor("#FFFFFF");
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {token === null ? <Auth /> : <Root />}
    </View>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ToastProvider
            offset={70}
            successColor="#295AF5"
            warningColor="#8E8E8E"
            dangerColor="#FF6534"
            duration={3000}
            animationType="zoom-in"
            style={{ borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, fontFamily: "NotoSansKR-Regular" }}
            successIcon={<Ionicons name="checkmark-circle" size={18} color="white" />}
            warningIcon={<Ionicons name="checkmark-circle" size={18} color="white" />}
            dangerIcon={<Ionicons name="close-circle" size={18} color="white" />}
          >
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </ToastProvider>
        </Provider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: {
    title: "...",
    optionalUpdateMessage: "...",
    optionalInstallButtonLabel: "업데이트",
    optionalIgnoreButtonLabel: "아니요.",
  },
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
