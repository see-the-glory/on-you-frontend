import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubStack from "./ClubStack";
import ProfileStack from "./ProfileStack";
import ClubManagementStack from "./ClubManagementStack";
import FeedStack from "./FeedStack";
import { Host } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/reducers";
import axios from "axios";
import { useAppDispatch } from "../redux/store";
import { logout, updateUser } from "../redux/slices/auth";
import { DeviceEventEmitter, Linking } from "react-native";
import { BaseResponse, ErrorResponse, TargetTokenUpdateRequest, UserApi, UserInfoResponse } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import feedSlice from "../redux/slices/feed";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import dynamicLinks, { FirebaseDynamicLinksTypes } from "@react-native-firebase/dynamic-links";
import { useNavigation } from "@react-navigation/native";
import queryString from "query-string";

const Nav = createNativeStackNavigator();

const Root = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const { refetch: userInfoRefecth } = useQuery<UserInfoResponse, ErrorResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.data) dispatch(updateUser({ user: res.data }));
    },
    onError: (error) => {
      console.log(`API ERROR | getUserInfo ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    enabled: false,
  });

  const updateTargetTokenMutation = useMutation<BaseResponse, ErrorResponse, TargetTokenUpdateRequest>(UserApi.updateTargetToken);

  const updateTargetToken = (fcmToken: string | null) => {
    const requestData: TargetTokenUpdateRequest = {
      targetToken: fcmToken,
    };
    updateTargetTokenMutation.mutate(requestData, {
      onSuccess: (res) => {
        console.log(`API CALL | updateTargetToken : ${fcmToken}`);
      },
      onError: (error) => {
        console.log(`API ERROR | updateTargetToken ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });
  };

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    const parsed = queryString.parseUrl(link?.url);
    const match = parsed.url.split("/").pop();
    switch (match) {
      case "club":
        navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: parsed.query.id } } });
        break;

      default:
        break;
    }
  };

  const handlePushMessage = (data: any) => {
    switch (data?.type) {
      case "APPLY":
        navigation.navigate("ProfileStack", { screen: "UserNotification" });
        break;
      case "APPROVE":
        navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: data?.clubId } } });
        break;
      case "REJECT":
        navigation.navigate("ProfileStack", { screen: "UserNotification" });
        break;
      case "FEED_CREATE":
        navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: data?.clubId } } });
        break;
      case "FEED_COMMENT":
        console.log(data);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log(`Root - useEffect!`);
    // Axios Setting
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
            if (!error.response.data) error.response.data = { message: "잘못된 요청입니다." };
          } else if (status === 401) {
            DeviceEventEmitter.emit("Logout", { fcmToken });
            toast.show(`중복 로그인이 감지되어\n로그아웃 합니다.`, { type: "warning" });
          } else if (status === 500) {
            console.log(error.response.data);
            // toast.show(`${error?.response?.data?.error}`, { type: "warning" });
            // toast.show(`${error?.response?.data?.message}`, { type: "warning" });
            error.response.data = { message: "알 수 없는 오류" };
          }
          return Promise.reject({ ...error.response?.data, status, code: error.code });
        } else {
          return Promise.reject({ message: "요청시간이 만료되었습니다.", code: error.code });
        }
      }
    );

    // User Infomation Resetting
    userInfoRefecth();

    // Feed Resetting
    queryClient.resetQueries(["feeds"]);

    // Target Token Update
    if (fcmToken) updateTargetToken(fcmToken);

    // Version Infomation Check

    //

    const logoutSubScription = DeviceEventEmitter.addListener("Logout", async ({ fcmToken, isWitdrawUser }) => {
      console.log(`Root - Logout`);
      const res = await dispatch(logout());
      if (res.meta.requestStatus === "fulfilled") {
        if (!isWitdrawUser) toast.show(`로그아웃 되었습니다.`, { type: "success" });
        try {
          if (fcmToken && !isWitdrawUser) updateTargetToken(null);
          if (!fcmToken) console.log(`Root - Logout : FCM Token 이 없습니다.`);
          dispatch(feedSlice.actions.deleteFeed());
        } catch (e) {
          console.warn(e);
        }
      } else toast.show(`로그아웃 실패.`, { type: "warning" });
    });

    const dynamicLinksUnsubscribe = dynamicLinks().onLink(handleDynamicLink);

    // Firebase - Foreground Push
    const fcmUnsubscribe = messaging().onMessage(async (message) => {
      try {
        await notifee.displayNotification({
          title: message?.notification?.title,
          body: message?.notification?.body,
          android: {
            channelId: "club",
            pressAction: { id: "default" },
          },
          data: message?.data,
        });
      } catch (e) {
        console.warn(e);
      }
    });

    // Firebase - bacgkround 에서 실행 중에 push 가 선택될 경우
    const unsubscribeNotification = messaging().onNotificationOpenedApp((message) => {
      console.log("onNotificationOpenedApp --");
      handlePushMessage(message?.data);
    });

    // Firebase - 앱이 종료되었는데 push 가 선택될 경우
    messaging()
      .getInitialNotification()
      .then((message) => {
        console.log("Firebase - getInitialNotification");
        handlePushMessage(message?.data);
      });

    // Notifee - 앱이 종료되었는데 push 가 선택될 경우
    notifee.getInitialNotification().then((message) => {
      console.log("Notifee - getInitialNotification");
      handlePushMessage(message?.notification?.data);
    });

    const notiUnsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          handlePushMessage(detail?.notification?.data);
          break;
      }
    });

    return () => {
      console.log(`Root - remove!`);
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
      logoutSubScription.remove();
      fcmUnsubscribe();
      notiUnsubscribe();
      dynamicLinksUnsubscribe();
      unsubscribeNotification();
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
          <Nav.Screen name="FeedStack" component={FeedStack} />
          <Nav.Screen name="ClubStack" component={ClubStack} />
          <Nav.Screen name="ProfileStack" component={ProfileStack} />
          <Nav.Screen name="ClubCreationStack" component={ClubCreationStack} />
          <Nav.Screen name="ClubManagementStack" component={ClubManagementStack} />
        </Nav.Navigator>
      }
    ></Host>
  );
};
export default Root;
