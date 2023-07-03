import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import Root from "@navigation/Root";
import Auth from "@navigation/Auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector } from "react-redux";
import { RootState } from "redux/store/reducers";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { LogBox, Platform, Text, TextInput, View } from "react-native";
import * as Font from "expo-font";
import SplashScreen from "react-native-splash-screen";
import moment from "moment";
import "moment/locale/ko";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store, { useAppDispatch } from "redux/store";
import messaging from "@react-native-firebase/messaging";
import { init, updateFCMToken } from "redux/slices/auth";
import BackgroundColor from "react-native-background-color";
import CodePush from "react-native-code-push";
import notifee, { AndroidImportance } from "@notifee/react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import queryString from "query-string";
import { ThemeProvider } from "styled-components/native";
import { lightTheme } from "app/theme";

LogBox.ignoreLogs(["Setting a timer"]);

const RootNavigation = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useAppDispatch();

  const timezoneSetting = () => {
    moment.tz.setDefault("Asia/Seoul");
    moment.updateLocale("ko", {
      relativeTime: { future: "%s 후", past: "%s 전", s: "1초", m: "1분", mm: "%d분", h: "1시간", hh: "%d시간", d: "1일", dd: "%d일", M: "1달", MM: "%d달", y: "1년", yy: "%d년" },
    });
  };

  const fontSetting = async () => {
    await Font.loadAsync({
      "NotoSansKR-Bold": require("@fonts/NotoSansKR/NotoSansKR-Bold.otf"),
      "NotoSansKR-Regular": require("@fonts/NotoSansKR/NotoSansKR-Regular.otf"),
      "NotoSansKR-Medium": require("@fonts/NotoSansKR/NotoSansKR-Medium.otf"),
      AppleSDGothicNeoB: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoB.ttf"),
      AppleSDGothicNeoEB: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoEB.ttf"),
      AppleSDGothicNeoSB: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoSB.ttf"),
      AppleSDGothicNeoL: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoL.ttf"),
      AppleSDGothicNeoM: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoM.ttf"),
      AppleSDGothicNeoR: require("@fonts/AppleSDGothicNeo/AppleSDGothicNeoR.ttf"),
      "Roboto-Bold": require("@fonts/Roboto/Roboto-Bold.ttf"),
      "Roboto-Light": require("@fonts/Roboto/Roboto-Light.ttf"),
      "Roboto-Medium": require("@fonts/Roboto/Roboto-Medium.ttf"),
      "Roboto-Regular": require("@fonts/Roboto/Roboto-Regular.ttf"),
      "TT-Commons-Bold": require("@fonts/TTCommons/TT-Commons-Bold.otf"),
      "TT-Commons-DemiBold": require("@fonts/TTCommons/TT-Commons-DemiBold.otf"),
      "TT-Commons-Light": require("@fonts/TTCommons/TT-Commons-Light.otf"),
      "TT-Commons-Medium": require("@fonts/TTCommons/TT-Commons-Medium.otf"),
      "TT-Commons-Regular": require("@fonts/TTCommons/TT-Commons-Regular.otf"),
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
      await dispatch(init());
      await fontSetting();
      timezoneSetting();
      updateFCM();
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await SplashScreen.hide();
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
  const navigationRef = useNavigationContainerRef();
  const queryClient = new QueryClient();
  const linking = {
    prefixes: ["https://onyou.page.link"],
    async getInitialURL() {
      const message = await dynamicLinks().getInitialLink();
      return message?.url;
    },
    getStateFromPath(path, config) {
      const parsed = queryString.parseUrl(path);
      const state = { routes: [{ name: "Tabs" }] };
      const match = parsed.url.split("/").pop();
      switch (match) {
        case "club":
          state.routes.push({ name: "ClubStack", state: { routes: [{ name: "ClubTopTabs", params: { clubData: { id: parsed.query.id } } }] } });
          break;
        case "user":
          state.routes.push({ name: "ProfileStack", state: { routes: [{ name: "Profile", params: { userId: parsed.query.id } }] } });
          break;
        default:
          break;
      }
      return state;
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ToastProvider
            offset={70}
            successColor={lightTheme.primaryColor}
            warningColor={lightTheme.errorColor}
            dangerColor={lightTheme.accentColor}
            duration={3000}
            animationType="zoom-in"
            style={{ borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}
            textStyle={{ fontFamily: lightTheme.koreanFontR, lineHeight: 16 }}
            successIcon={<Ionicons name="checkmark-circle" size={16} color="white" />}
            warningIcon={<Ionicons name="close-circle" size={16} color="white" />}
            dangerIcon={<Ionicons name="alert-circle" size={16} color="white" />}
          >
            <ThemeProvider theme={lightTheme}>
              <NavigationContainer ref={navigationRef} linking={linking}>
                <RootNavigation />
              </NavigationContainer>
            </ThemeProvider>
          </ToastProvider>
        </Provider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
};

export default CodePush(codePushOptions)(App);
