import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import AuthStack from "./navigation/AuthStack";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Provider, useSelector } from "react-redux";
import { ToastProvider, useToast, Toast } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { Alert, DeviceEventEmitter, LogBox, Platform, Text, TextInput, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import "moment/locale/ko";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store, { useAppDispatch } from "./redux/store";
import messaging from "@react-native-firebase/messaging";
import { init, updateFCMToken } from "./redux/slices/auth";
import BackgroundColor from "react-native-background-color";
import { UserApi } from "./api";
import axios from "axios";

LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

//백그라운드에서 푸시를 받으면 호출됨
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

//푸시를 받으면 호출됨
messaging().onMessage(async (remoteMessage) => {
  Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
});

//알림창을 클릭한 경우 호출됨
messaging().onNotificationOpenedApp((remoteMessage) => {
  console.log("Notification caused app to open from background state:", remoteMessage.notification);
});

const RootNavigation = () => {
  const token = useSelector((state) => state.auth.token);
  const fcmToken = useSelector((state) => state.auth.fcmToken);
  const [appIsReady, setAppIsReady] = useState(false);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const updateTargetTokenMutation = useMutation(UserApi.updateTargetToken);
  const updateFCM = async (token) => {
    console.log("App - FCM token update");
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log(`enabled: ${enabled}`);
    if (!enabled) {
      console.log("FCM Authorization Fail");
      return;
    }
    try {
      if (Platform.OS === "android") await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log("FCM token:", fcmToken);
      console.log("Authorization status:", authStatus);
      dispatch(updateFCMToken({ fcmToken }));

      const requestData = {
        token,
        data: {
          targetToken: fcmToken,
        },
      };
      updateTargetTokenMutation.mutate(requestData, {
        onSuccess: (res) => {
          if (res.status === 200) {
            console.log(res);
            toast.show(`Target Token Update Success`, {
              type: "success",
            });
          } else {
            console.log("--- updateTargetToken Fail ---");
            console.log(res);
            toast.show(`Update Target Token Fail. (status: ${res.status})`, {
              type: "warning",
            });
          }
        },
        onError: (error) => {
          console.log("--- updateTargetToken Error ---");
          console.log(error);
          toast.show(`updateTargetToken API Fail (status: ${res.status})`, {
            type: "warning",
          });
        },
      });
    } catch (e) {
      console.warn(e);
    }
  };

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

  const apiSetting = (token) => {
    axios.defaults.baseURL = "http://3.39.190.23:8080";
    if (token) axios.defaults.headers.common["Authorization"] = token;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.interceptors.request.use(
      (config) => {
        config.timeout = 5000;
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => {}, // 2xx
      (error) => {
        // 2xx 범위 밖
        if (error.response) {
          status = error.response.status;
          if (status === 400) {
            if (!error.response.data)
              error.response.data = {
                message: "잘못된 요청입니다.",
              };
          } else if (status === 401) {
            dispatch(logout()).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                DeviceEventEmitter.emit("PushUnsubscribe", { fcmToken });
                error.response.data.message = "중복 로그인이 감지되어\n로그아웃 합니다.";
              } else {
                error.response.data.message = "로그아웃 실패";
              }
            });
          } else if (status === 500) {
            error.response.data.message = "알 수 없는 오류";
          }
        }

        return Promise.reject(error);
      }
    );
  };

  const prepare = async () => {
    try {
      console.log(`App - Prepare!`);
      await dispatch(init());
      await fontSetting();
      timezoneSetting();
      apiSetting();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  };

  useEffect(() => {
    prepare();
    if (Platform.OS === "android") BackgroundColor.setColor("#FFFFFF");

    // login 할 때
    const pushSubscription = DeviceEventEmitter.addListener("PushSubscribe", async ({ token }) => {
      console.log(`App - Push Subscribe`);
      if (token) await updateFCM(token);
    });

    // Logout 할 때
    const pushUnsubscriotion = DeviceEventEmitter.addListener("PushUnsubscribe", async ({ fcmToken }) => {
      console.log(`App - Push Unsubscribe`);
      try {
        await messaging().deleteToken(fcmToken);
      } catch (e) {
        console.warn(e);
      }
    });

    return () => {
      console.log(`App - remove listner`);
      pushSubscription.remove();
      pushUnsubscriotion.remove();
    };
  }, []);

  // 자동 로그인할 때
  useEffect(() => {
    // 로그인 확인 후 FCM 토큰이 없으면
    if (token && !fcmToken) updateFCM(token);
  }, [appIsReady]);

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
      {token === null ? <AuthStack /> : <Root />}
    </View>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ToastProvider
            offset={50}
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
