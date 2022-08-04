import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import LoginStack from "./navigation/LoginStack";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store";
import { Init } from "./store/actions";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

const queryClient = new QueryClient();

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const RootNavigation = () => {
  const [ready, setReady] = useState(false);
  const token = useSelector((state) => state.AuthReducers.authToken);
  const dispatch = useDispatch();

  const onFinish = () => setReady(true);

  // PreLoading
  const startLoading = async () => {
    await dispatch(Init());
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
          style={{ borderRadius: 20, paddingHorizontal: 25 }}
          icon={<Ionicons name="checkmark-circle" size={18} color="white" />}
        >
          <RootNavigation />
        </ToastProvider>
      </Provider>
    </QueryClientProvider>
  );
}
