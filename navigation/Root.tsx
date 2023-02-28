import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubStack from "./ClubStack";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import ClubManagementStack from "./ClubManagementStack";
import FeedStack from "./FeedStack";
import { Host } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/reducers";
import axios from "axios";
import { useAppDispatch } from "../redux/store";
import { logout, updateFCMToken, updateUser } from "../redux/slices/auth";
import { DeviceEventEmitter, Platform } from "react-native";
import { BaseResponse, ErrorResponse, TargetTokenUpdateRequest, UserApi, UserInfoResponse } from "../api";
import { useMutation, useQuery } from "react-query";
import messaging from "@react-native-firebase/messaging";

const Nav = createNativeStackNavigator();

const Root = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useQuery<UserInfoResponse, ErrorResponse>(["getUserInfo"], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.data) dispatch(updateUser({ user: res.data }));
    },
    onError: (error) => {
      console.log(`API ERROR | getClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    enabled: token ? true : false,
  });

  const updateTargetTokenMutation = useMutation<BaseResponse, ErrorResponse, TargetTokenUpdateRequest>(UserApi.updateTargetToken);

  const updateFCM = async () => {
    let fcmToken;
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log(`FCM Enabled: ${enabled}`);
    if (!enabled) {
      console.log("FCM Authorization Fail");
      return;
    }
    try {
      if (Platform.OS === "android") await messaging().registerDeviceForRemoteMessages();
      fcmToken = await messaging().getToken();
      console.log("FCM token:", fcmToken);
      dispatch(updateFCMToken({ fcmToken }));
    } catch (e) {
      console.warn(e);
    }

    if (fcmToken) {
      const requestData: TargetTokenUpdateRequest = {
        targetToken: fcmToken,
      };
      updateTargetTokenMutation.mutate(requestData, {
        onSuccess: (res) => {},
        onError: (error) => {
          console.log(`API ERROR | updateTargetToken ${error.code} ${error.status}`);
          toast.show(`${error.message ?? error.code}`, { type: "warning" });
        },
      });
    }

    return fcmToken;
  };

  useEffect(() => {
    console.log(`Root - useEffect!`);
    console.log(`Root - Axios Setting`);
    axios.defaults.baseURL = "http://3.39.190.23:8080";
    if (token) axios.defaults.headers.common["Authorization"] = token;
    axios.defaults.headers.common["Content-Type"] = "application/json";

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        config.timeout = 5000;
        return config;
      },
      (error) => error
    );
    const responseInterceptor = axios.interceptors.response.use(
      (response) => ({ ...response.data, status: response.status }), // 2xx
      async (error) => {
        // 2xx 범위 밖
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            if (!error.response.data) {
              error.response.data = {
                message: "잘못된 요청입니다.",
              };
              toast.show(`잘못된 요청입니다`, { type: "warning" });
            }
          } else if (status === 401) {
            console.log(error);
            const res = await dispatch(logout());
            if (res.meta.requestStatus === "fulfilled") {
              DeviceEventEmitter.emit("Logout", { fcmToken });
              error.response.data.message = "중복 로그인이 감지되어\n로그아웃 합니다.";
              toast.show(`중복 로그인이 감지되어\n로그아웃 합니다.`, { type: "warning" });
            } else {
              error.response.data.message = "로그아웃 실패";
              toast.show(`로그아웃 실패`, { type: "warning" });
            }
          } else if (status === 500) {
            error.response.data.message = "알 수 없는 오류";
            toast.show(`알 수 없는 오류`, { type: "warning" });
          }
          return { ...error.response?.data, status, code: error.code };
        } else {
          toast.show(`요청시간이 만료되었습니다.`, { type: "warning" });
          return { message: "요청시간이 만료되었습니다.", code: error.code };
        }
      }
    );

    console.log(`Root - FCM Setting`);
    updateFCM();

    const logoutSubScription = DeviceEventEmitter.addListener("Logout", async ({ fcmToken }) => {
      console.log(`Root - Logout`);
      try {
        if (fcmToken) await messaging().deleteToken(fcmToken);
      } catch (e) {
        console.warn(e);
      }
    });

    return () => {
      console.log(`Root - remove!`);
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
      logoutSubScription.remove();
    };
  }, []);

  return (
    <Host
      children={
        <Nav.Navigator
          screenOptions={{
            presentation: "card",
            headerShown: false,
          }}
        >
          <Nav.Screen name="Tabs" component={Tabs} />
          <Nav.Screen name="ClubCreationStack" component={ClubCreationStack} />
          <Nav.Screen name="ClubManagementStack" component={ClubManagementStack} />
          <Nav.Screen name="ClubStack" component={ClubStack} />
          <Nav.Screen name="HomeStack" component={HomeStack} />
          <Nav.Screen name="ProfileStack" component={ProfileStack} />
          <Nav.Screen name="FeedStack" component={FeedStack} />
        </Nav.Navigator>
      }
    ></Host>
  );
};
export default Root;
