import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Alert, Animated, BackHandler, DeviceEventEmitter, Platform, StatusBar, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ClubHome from "../Club/ClubHome";
import ClubFeed from "../Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../../components/ClubHeader";
import ClubTabBar from "../../components/ClubTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useMutation, useQuery } from "react-query";
import { BaseResponse, Club, ClubApi, ClubDeletionRequest, ClubResponse, ClubRoleResponse, ClubSchedulesResponse, ClubWithdrawRequest, ErrorResponse, NotificationsResponse } from "../../api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { RefinedSchedule } from "../../Types/Club";
import moment from "moment-timezone";
import { RootState } from "../../redux/store/reducers";
import { useAppDispatch } from "../../redux/store";
import clubSlice from "../../redux/slices/club";
import Share from "react-native-share";
import dynamicLinks from "@react-native-firebase/dynamic-links";

const Container = styled.View`
  flex: 1;
`;

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
  padding: 10px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const NotiView = styled.View``;
const NotiBadge = styled.View`
  position: absolute;
  top: 0px;
  right: -4px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  z-index: 1;
  background-color: #ff6534;
  justify-content: center;
  align-items: center;
`;
const NotiBadgeText = styled.Text`
  color: white;
  font-size: 6px;
`;

const TopTab = createMaterialTopTabNavigator();

const HEADER_EXPANDED_HEIGHT = 270;
const HEADER_HEIGHT = 100;
const TAB_BUTTON_HEIGHT = 46;

const ClubTopTabs = ({
  route: {
    params: { clubData },
  },
  navigation: { navigate, popToTop },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Club>(clubData);
  const [scheduleData, setScheduleData] = useState<RefinedSchedule[]>();
  const [notiCount, setNotiCount] = useState<number>(0);
  const [isShareOpend, setIsShareOpend] = useState<boolean>(false);
  // Header Height Definition
  const { top } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const headerConfig = useMemo(
    () => ({
      heightCollapsed: top + HEADER_HEIGHT,
      heightExpanded: HEADER_EXPANDED_HEIGHT,
    }),
    [top, HEADER_HEIGHT, HEADER_EXPANDED_HEIGHT]
  );
  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed;

  // API Calling
  const withdrawClubMutation = useMutation<BaseResponse, ErrorResponse, ClubWithdrawRequest>(ClubApi.withdrawClub, {
    onSuccess: (res) => {
      toast.show(`모임에서 탈퇴하셨습니다.`, { type: "success" });
      DeviceEventEmitter.emit("ClubRefetch");
    },
    onError: (error) => {
      console.log(`API ERROR | withdrawClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const deleteClubMutation = useMutation<BaseResponse, ErrorResponse, ClubDeletionRequest>(ClubApi.deleteClub, {
    onSuccess: (res) => {
      toast.show(`모임이 삭제되었습니다.`, { type: "success" });
      DeviceEventEmitter.emit("ClubListRefetch");
      popToTop();
    },
    onError: (error) => {
      console.log(`API ERROR | deleteClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const { isLoading: clubLoading, refetch: clubDataRefetch } = useQuery<ClubResponse, ErrorResponse>(["getClub", clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      setData(res.data);
    },
    onError: (error) => {
      console.log(`API ERROR | getClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const {
    isLoading: clubRoleLoading,
    data: clubRole,
    refetch: clubRoleRefetch,
  } = useQuery<ClubRoleResponse, ErrorResponse>(["getClubRole", data.id], ClubApi.getClubRole, {
    onSuccess: (res) => {
      dispatch(clubSlice.actions.updateClubRole({ role: res.data.role, applyStatus: res.data.applyStatus }));
    },
    onError: (error) => {
      console.log(`API ERROR | getClubRole ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const { isLoading: schedulesLoading, refetch: schedulesRefetch } = useQuery<ClubSchedulesResponse, ErrorResponse>(["getClubSchedules", data.id], ClubApi.getClubSchedules, {
    onSuccess: (res) => {
      const week = ["일", "월", "화", "수", "목", "금", "토"];
      const result: RefinedSchedule[] = [];
      for (let i = 0; i < res?.data?.length; ++i) {
        const date = moment(res.data[i].startDate).tz("Asia/Seoul");
        const dayOfWeek = week[date.day()];
        let refined: RefinedSchedule = {
          id: res.data[i].id,
          location: res.data[i].location,
          name: res.data[i].name,
          members: res.data[i].members,
          startDate: res.data[i].startDate,
          endDate: res.data[i].endDate,
          content: res.data[i].content,
          year: date.format("YYYY"),
          month: date.format("MM"),
          day: date.format("DD"),
          hour: date.format("h"),
          minute: date.format("m"),
          ampm: date.format("A"),
          dayOfWeek: dayOfWeek,
          participation: res.data[i].members?.map((member) => member.id).includes(me?.id),
          isEnd: false,
        };
        result.push(refined);
      }
      result.push({ isEnd: true });
      setScheduleData(result);
    },
    onError: (error) => {
      console.log(`API ERROR | getClubSchedules ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const { isLoading: notiLoading, refetch: clubNotiRefetch } = useQuery<NotificationsResponse, ErrorResponse>(["getClubNotifications", data.id], ClubApi.getClubNotifications, {
    onSuccess: (res) => {
      setNotiCount(res?.data.filter((item) => !item.processDone).length);
    },
    onError: (error) => {
      console.log(`API ERROR | getClubNotifications ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  // Animated Variables
  const screenScrollRefs = useRef<any>({});
  const screenScrollOffset = useRef<any>({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetY = useSelector((state: RootState) => state.club.homeScrollY);
  const scheduleOffsetX = useSelector((state: RootState) => state.club.scheduleScrollX);
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });

  // Screen Scroll Sync
  const syncScrollOffset = (screenName: string) => {
    screenScrollOffset.current[screenName] = scrollY._value;
    for (const [key, ref] of Object.entries(screenScrollRefs.current)) {
      if (key === screenName) continue;
      const offsetY = screenScrollOffset.current[key] ?? 0;
      if (scrollY._value < headerDiff) {
        if (ref.scrollTo) {
          ref.scrollTo({
            x: 0,
            y: scrollY._value,
            animated: false,
          });
        } else {
          ref.scrollToOffset({
            offset: scrollY._value,
            animated: false,
          });
        }
        screenScrollOffset.current[key] = scrollY._value;
      } else if (scrollY._value >= headerDiff && offsetY < headerDiff) {
        if (ref.scrollTo) {
          ref.scrollTo({
            x: 0,
            y: headerDiff,
            animated: false,
          });
        } else {
          ref.scrollToOffset({
            offset: headerDiff,
            animated: false,
          });
        }
        screenScrollOffset.current[key] = headerDiff;
      }
    }
  };

  // Function in Modal
  const goToClubEdit = () => {
    navigate("ClubManagementStack", {
      screen: "ClubManagementMain",
      clubData: data,
    });
  };

  const goToClubJoin = () => {
    if (clubRole?.data?.applyStatus === "APPLIED") {
      return toast.show("가입신청서가 이미 전달되었습니다.", { type: "warning" });
    }
    if (data?.recruitStatus === "CLOSE") {
      return toast.show("멤버 모집 기간이 아닙니다.", { type: "warning" });
    }

    navigate("ClubJoin", { clubData: data });
  };

  const goToFeedCreation = () => {
    if (me === undefined) {
      toast.show("유저 정보를 알 수 없습니다.", { type: "warning" });
      return;
    }
    navigate("FeedStack", {
      screen: "ImageSelecter",
      userId: me?.id,
      clubId: data.id,
    });
  };

  const goClubNotification = () => {
    const clubNotificationProps = {
      clubData: data,
      clubRole: clubRole?.data,
    };
    navigate("ClubNotification", clubNotificationProps);
  };

  const openShare = async () => {
    setIsShareOpend(true);
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://onyou.page.link/club?id=${data.id}`,
        domainUriPrefix: "https://onyou.page.link",
        android: { packageName: "com.onyoufrontend" },
        ios: { bundleId: "com.onyou.project", appStoreId: "1663717005" },
        social: {
          title: data?.name ?? "",
          descriptionText: data?.clubShortDesc ?? "",
          imageUrl: data?.thumbnail ?? "",
        },
        // navigation: { forcedRedirectEnabled: true }, // iOS에서 preview page를 스킵하는 옵션. 이걸 사용하면 온유앱이 꺼져있을 때는 제대로 navigation이 되질 않는 버그가 있음.
      },
      dynamicLinks.ShortLinkType.SHORT
    );
    const title = data.name;
    const options = Platform.select({
      default: {
        title,
        subject: title,
        message: `${link}`,
      },
    });
    try {
      await Share.open(options);
    } catch (e) {}
    setIsShareOpend(false);
  };

  const withdrawClub = () => {
    const requestData = { clubId: data.id };
    Alert.alert("모임 탈퇴", "정말로 모임에서 탈퇴하시겠습니까?", [
      { text: "아니요" },
      {
        text: "예",
        onPress: () => {
          if (data.members?.length === 1 && data.members[0].id === me?.id && data.members[0].role === "MASTER")
            Alert.alert("모임 삭제 안내", "현재 모임의 리더입니다. 모임을 탈퇴할 시 이 모임은 삭제됩니다. 삭제하시겠습니까?", [
              { text: "아니요" },
              {
                text: "예",
                onPress: () => {
                  deleteClubMutation.mutate(requestData);
                },
              },
            ]);
          else withdrawClubMutation.mutate(requestData);
        },
      },
    ]);
  };

  useEffect(() => {
    const scrollListener = scrollY.addListener(({ value }) => {});

    console.log("ClubTopTabs - add listner");
    const scheduleSubscription = DeviceEventEmitter.addListener("SchedulesRefetch", () => {
      console.log("ClubTopTabs - Schedule Refetch Event");
      schedulesRefetch();
    });
    const clubSubscription = DeviceEventEmitter.addListener("ClubRefetch", () => {
      console.log("ClubTopTabs - ClubData, ClubRole Refetch Event");
      clubDataRefetch();
      clubRoleRefetch();
      clubNotiRefetch();
    });
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      popToTop();
      return true;
    });

    return () => {
      scrollY.removeListener(scrollListener);
      scheduleSubscription.remove();
      clubSubscription.remove();
      backHandler.remove();
      dispatch(clubSlice.actions.deleteClub());
      console.log("ClubTopTabs - remove listner & delete clubslice");
    };
  }, []);

  const renderClubHome = useCallback(
    (props: any) => {
      props.route.params.clubData = data;
      return (
        <ClubHome
          {...props}
          scrollY={scrollY}
          offsetY={offsetY}
          scheduleOffsetX={scheduleOffsetX}
          headerDiff={headerDiff}
          schedules={scheduleData}
          syncScrollOffset={syncScrollOffset}
          screenScrollRefs={screenScrollRefs}
        />
      );
    },
    [headerDiff, data, scheduleData]
  );
  const renderClubFeed = useCallback(
    (props: any) => <ClubFeed {...props} offsetY={offsetY} scrollY={scrollY} headerDiff={headerDiff} syncScrollOffset={syncScrollOffset} screenScrollRefs={screenScrollRefs} />,
    [headerDiff]
  );

  return (
    <Container>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
      <NavigationView height={HEADER_HEIGHT}>
        <LeftNavigationView>
          <TouchableOpacity onPress={() => popToTop()}>
            <Entypo name="chevron-thin-left" size={20} color="white" />
          </TouchableOpacity>
        </LeftNavigationView>
        <RightNavigationView>
          {clubRole?.data?.role && clubRole.data.role !== "PENDING" ? (
            <TouchableOpacity onPress={goClubNotification} style={{ paddingHorizontal: 8 }}>
              <NotiView>
                {notiCount > 0 && !notiLoading ? <NotiBadge>{/* <NotiBadgeText>{notiCount}</NotiBadgeText> */}</NotiBadge> : <></>}
                <Ionicons name="mail-outline" size={24} color="white" />
              </NotiView>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TouchableOpacity disabled={isShareOpend} onPress={openShare} style={{ paddingLeft: 10, paddingRight: 1 }}>
            <Ionicons name="ios-share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </RightNavigationView>
      </NavigationView>

      <ClubHeader
        imageURI={data.thumbnail}
        name={data.name}
        shortDesc={data.clubShortDesc}
        categories={data.categories}
        recruitStatus={data.recruitStatus}
        schedules={scheduleData}
        heightExpanded={heightExpanded}
        heightCollapsed={heightCollapsed}
        headerDiff={headerDiff}
        scrollY={scrollY}
      />

      <Animated.View
        style={{
          position: "absolute",
          zIndex: 2,
          flex: 1,
          width: "100%",
          height: SCREEN_HEIGHT + headerDiff,
          paddingTop: heightExpanded,
          transform: [{ translateY }],
        }}
      >
        <TopTab.Navigator
          initialRouteName="ClubHome"
          screenOptions={{ swipeEnabled: false }}
          tabBar={(props) => <ClubTabBar {...props} height={TAB_BUTTON_HEIGHT} />}
          sceneContainerStyle={{ position: "absolute", zIndex: 1 }}
        >
          <TopTab.Screen options={{ tabBarLabel: "모임 정보" }} name="ClubHome" component={renderClubHome} initialParams={{ clubData: data }} />
          <TopTab.Screen options={{ tabBarLabel: "게시물" }} name="ClubFeed" component={renderClubFeed} initialParams={{ clubData: data }} />
        </TopTab.Navigator>
      </Animated.View>

      {clubRoleLoading ? (
        <></>
      ) : (
        <FloatingActionButton
          role={clubRole?.data?.role}
          recruitStatus={data?.recruitStatus}
          goToClubEdit={goToClubEdit}
          goToClubJoin={goToClubJoin}
          goToFeedCreation={goToFeedCreation}
          withdrawclub={withdrawClub}
        />
      )}
    </Container>
  );
};

export default ClubTopTabs;
