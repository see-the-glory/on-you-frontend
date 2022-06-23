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
        <RootNavigation />
      </Provider>
    </QueryClientProvider>
  );
}
