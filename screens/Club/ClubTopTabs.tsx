import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Alert, Animated, DeviceEventEmitter, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ClubHome from "../Club/ClubHome";
import ClubFeed from "../Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../../components/ClubHeader";
import ClubTabBar from "../../components/ClubTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useMutation, useQuery } from "react-query";
import { BaseResponse, Club, ClubApi, ClubResponse, ClubRoleResponse, ClubSchedulesResponse, ClubWithdrawRequest, ErrorResponse } from "../../api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { RefinedSchedule } from "../../Types/Club";
import moment from "moment-timezone";
import { RootState } from "../../redux/store/reducers";
import { useAppDispatch } from "../../redux/store";
import clubSlice from "../../redux/slices/club";

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
  padding-left: 10px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 10px;
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
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Club>(clubData);
  const [scheduleData, setScheduleData] = useState<RefinedSchedule[]>();
  const [heartSelected, setHeartSelected] = useState<boolean>(false);
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
      return toast.show("가입신청서가 이미 전달되었습니다.", {
        type: "warning",
      });
    }
    if (data?.recruitStatus === "CLOSE") {
      return toast.show("멤버 모집 기간이 아닙니다.", {
        type: "warning",
      });
    }

    navigate("ClubJoin", { clubData: data });
  };

  const goToFeedCreation = () => {
    if (me === undefined) {
      toast.show("유저 정보를 알 수 없습니다.", {
        type: "warning",
      });
      return;
    }
    navigate("FeedStack", {
      screen: "ImageSelecter",
      userId: me?.id,
      clubId: data.id,
    });
  };

  const goClubNotification = () => {
    navigate("ClubNotification", { clubData: data, clubRole: clubRole?.data });
  };

  const withdrawClub = () => {
    Alert.alert("모임 탈퇴", "정말로 모임에서 탈퇴하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          let requestData: ClubWithdrawRequest = {
            clubId: data.id,
          };
          withdrawClubMutation.mutate(requestData);
        },
      },
    ]);
  };

  // API Calling

  const withdrawClubMutation = useMutation<BaseResponse, ErrorResponse, ClubWithdrawRequest>(ClubApi.withdrawClub, {
    onSuccess: (res) => {
      toast.show(`모임에서 탈퇴하셨습니다.`, {
        type: "success",
      });
      DeviceEventEmitter.emit("ClubRefetch");
    },
    onError: (error) => {
      console.log(`API ERROR | withdrawClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, {
        type: "warning",
      });
    },
  });

  const { isLoading: clubLoading, refetch: clubDataRefetch } = useQuery<ClubResponse, ErrorResponse>(["getClub", clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      setData(res.data);
    },
    onError: (error) => {
      console.log(`API ERROR | getClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, {
        type: "warning",
      });
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
      toast.show(`${error.message ?? error.code}`, {
        type: "warning",
      });
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
      toast.show(`${error.message ?? error.code}`, {
        type: "warning",
      });
    },
  });

  useEffect(() => {
    scrollY.addListener(({ value }) => {});

    console.log("ClubTopTabs - add listner");
    let scheduleSubscription = DeviceEventEmitter.addListener("SchedulesRefetch", () => {
      console.log("ClubTopTabs - Schedule Refetch Event");
      schedulesRefetch();
    });
    let clubSubscription = DeviceEventEmitter.addListener("ClubRefetch", () => {
      console.log("ClubTopTabs - ClubData, ClubRole Refetch Event");
      clubDataRefetch();
      clubRoleRefetch();
    });

    return () => {
      scrollY.removeListener();
      scheduleSubscription.remove();
      clubSubscription.remove();
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
            <TouchableOpacity onPress={goClubNotification} style={{ marginRight: 10 }}>
              <Ionicons name="mail-outline" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {/* 하트는 이후 공개 */}
          {/* <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)} style={{ marginRight: 10 }}>
            {heartSelected ? <Ionicons name="md-heart" size={24} color="white" /> : <Ionicons name="md-heart-outline" size={24} color="white" />}
          </TouchableOpacity> */}
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
          screenOptions={{
            swipeEnabled: false,
          }}
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
