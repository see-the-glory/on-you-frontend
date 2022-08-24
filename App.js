import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import LoginStack from "./navigation/LoginStack";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store/Index";
import { Init } from "./store/Actions";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { LogBox, Platform, Text, TextInput } from "react-native";
import * as Font from "expo-font";

LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient();

const RootNavigation = () => {
  const [ready, setReady] = useState(false);
  const token = useSelector((state) => state.AuthReducers.authToken);
  const dispatch = useDispatch();
  const onFinish = () => setReady(true);

  // PreLoading
  const startLoading = async () => {
    await dispatch(Init());
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

  if (!ready) {
    return <AppLoading startAsync={startLoading} onFinish={onFinish} onError={console.error} />;
  }

  return <NavigationContainer>{token === null ? <LoginStack /> : <Root />}</NavigationContainer>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ToastProvider
          offset={50}
          successColor="#295AF5"
          warningColor="#8E8E8E"
          duration={3000}
          animationType="zoom-in"
          style={{ borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, fontFamily: "NotoSansKR-Regular" }}
          icon={<Ionicons name="checkmark-circle" size={18} color="white" />}
        >
          <RootNavigation />
        </ToastProvider>
      </Provider>
    </QueryClientProvider>
  );
}
