import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs, { MainBottomTabParamList } from "./Tabs";
import ClubCreationStack, { ClubCreationStackParamList } from "./ClubCreationStack";
import ClubStack, { ClubStackParamList } from "./ClubStack";
import ProfileStack, { ProfileStackParamList } from "./ProfileStack";
import ClubManagementStack, { ClubManagementStackParamList } from "./ClubManagementStack";
import FeedStack, { FeedStackParamList } from "./FeedStack";
import { Host } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/reducers";
import axios from "axios";
import { useAppDispatch } from "../redux/store";
import { logout, updateUser } from "../redux/slices/auth";
import { BackHandler, DeviceEventEmitter, Linking, Modal, Platform, View } from "react-native";
import { BaseResponse, BASE_URL, ErrorResponse, MetaInfoRequest, MetaInfoResponse, TargetTokenUpdateRequest, UserApi, UserInfoResponse } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import feedSlice from "../redux/slices/feed";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import dynamicLinks, { FirebaseDynamicLinksTypes } from "@react-native-firebase/dynamic-links";
import { NavigationProp, NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import queryString from "query-string";
import { getModel, getVersion } from "react-native-device-info";
import styled from "styled-components/native";
import CustomText from "../components/atoms/CustomText";
import Parking from "../components/pages/Parking/Parking";
import Search from "../components/pages/Find/Search";
import { lightTheme } from "../theme";
import ChatStack, { ChatStackParamList } from "./ChatStack";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<MainBottomTabParamList>;
  FeedStack: NavigatorScreenParams<FeedStackParamList>;
  ClubStack: NavigatorScreenParams<ClubStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  ClubCreationStack: NavigatorScreenParams<ClubCreationStackParamList>;
  ClubManagementStack: NavigatorScreenParams<ClubManagementStackParamList>;
  ChatStack: NavigatorScreenParams<ChatStackParamList>;
  Parking: undefined;
  Search: undefined;
};

const Nav = createNativeStackNavigator<RootStackParamList>();

const ModalContainer = styled.View`
  width: 80%;
  padding: 15px 20px 15px 20px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
  border-radius: 10px;
`;

const Content = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 40px;
`;

const ContentText = styled(CustomText)`
  font-size: 15px;
  line-height: 21px;
`;

const Footer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ExitAppButton = styled.TouchableOpacity`
  margin-right: 20px;
`;

const UpdateButton = styled.TouchableOpacity``;

const ExitAppText = styled(CustomText)`
  font-size: 15px;
  line-height: 21px;
  opacity: 0.5;
`;

const UpdateText = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 16px;
  line-height: 22px;
`;

const Root = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const [updateRequire, setUpdateRequire] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
  const updateMetaInfoMutation = useMutation<MetaInfoResponse, ErrorResponse, MetaInfoRequest>(UserApi.metaInfo);

  const updateTargetToken = (fcmToken: string | null) => {
    const requestData: TargetTokenUpdateRequest = { targetToken: fcmToken };
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

  const updateMetaInfo = async () => {
    let deviceInfo = await getModel();
    let currentVersion = await getVersion();
    const requestData: MetaInfoRequest = { deviceInfo, currentVersion };

    updateMetaInfoMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.data.updateRequired === "Y") setUpdateRequire(true);
      },
      onError: (error) => {
        console.log(`API ERROR | updateMetaInfo ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });
  };

  const exitApp = () => {
    BackHandler.exitApp();
  };

  const goToStore = () => {
    if (Platform.OS === "android") Linking.openURL("https://play.google.com/store/apps/details?id=com.onyoufrontend");
    else if (Platform.OS === "ios") Linking.openURL("itms-apps://apps.apple.com/kr/app/%EC%98%A8%EC%9C%A0/id1663717005");
  };

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    const parsed = queryString.parseUrl(link?.url);
    const match = parsed.url.split("/").pop();
    switch (match) {
      case "club":
        navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubId: parsed.query.id } });
        break;
      case "user":
        navigation.navigate("ProfileStack", { screen: "Profile", params: { userId: parsed.query.id } });
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
        if (data?.clubId) navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubId: data?.clubId } });
        break;
      case "REJECT":
        navigation.navigate("ProfileStack", { screen: "UserNotification" });
        break;
      case "SCHEDULE_CREATE":
        if (data?.clubId) navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubId: data?.clubId } });
        break;
      case "FEED_CREATE":
        if (data?.feedId) navigation.navigate("FeedStack", { screen: "FeedSelection", params: { selectFeedId: data.feedId } });
        else if (data?.clubId) navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubId: data?.clubId } });
        break;
      case "FEED_COMMENT":
        if (data?.feedId) navigation.navigate("FeedStack", { screen: "FeedSelection", params: { selectFeedId: data.feedId } });
        break;
      case "COMMENT_REPLY":
        if (data?.feedId) navigation.navigate("FeedStack", { screen: "FeedSelection", params: { selectFeedId: data.feedId } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log(`Root - useEffect!`);
    // Axios Setting
    axios.defaults.baseURL = BASE_URL;
    if (token) axios.defaults.headers.common["Authorization"] = token;
    axios.defaults.headers.common["Content-Type"] = "application/json";

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        config.timeout = 15000;
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
          console.log(error.response);
          navigation.navigate("Parking");
          return Promise.reject({ message: "요청시간이 만료되었습니다.", code: error.code });
        }
      }
    );

    // User Infomation Resetting
    userInfoRefecth();

    // Feed Resetting
    queryClient.resetQueries(["getFeeds"]);

    // Target Token Update
    if (fcmToken) updateTargetToken(fcmToken);

    // Version Infomation Check
    updateMetaInfo();
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
    <>
      {updateRequire ? (
        <Modal transparent visible={updateRequire} animationType="fade" supportedOrientations={["landscape", "portrait"]}>
          <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <ModalContainer>
              <Content>
                <ContentText>{`온유 앱이 업데이트 되었습니다.\n조금 더 편리해지고 예뻐졌답니다.\n앱 업데이트 부탁드려요 :)`}</ContentText>
              </Content>
              <Footer>
                {Platform.OS === "android" ? (
                  <ExitAppButton onPress={exitApp}>
                    <ExitAppText>{`앱 종료`}</ExitAppText>
                  </ExitAppButton>
                ) : (
                  <></>
                )}
                <UpdateButton onPress={goToStore}>
                  <UpdateText>{`지금 업데이트`}</UpdateText>
                </UpdateButton>
              </Footer>
            </ModalContainer>
          </View>
        </Modal>
      ) : (
        <></>
      )}
      <Host
        children={
          <Nav.Navigator
            initialRouteName="Tabs"
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
            <Nav.Screen name="ChatStack" component={ChatStack} />
            <Nav.Screen name="Parking" component={Parking} options={{ gestureEnabled: false }} />
            <Nav.Screen
              name="Search"
              component={Search}
              options={{
                headerShown: true,
                title: "모임 검색",
                contentStyle: { backgroundColor: "white" },
                headerTitleAlign: "center",
                headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
                headerShadowVisible: false,
                headerBackVisible: false,
              }}
            />
          </Nav.Navigator>
        }
      ></Host>
    </>
  );
};
export default Root;
