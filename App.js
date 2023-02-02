import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import AuthStack from "./navigation/AuthStack";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector, useDispatch } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { LogBox, Platform, Text, TextInput, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import moment from "moment";
import "moment/locale/ko";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store, { useAppDispatch } from "./redux/store";
import { init } from "./redux/slices/auth";

LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function prepare() {
      try {
        console.log(`App Prepare!`);
        await dispatch(init());
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
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
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
            dangerColor="#FF714B"
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
