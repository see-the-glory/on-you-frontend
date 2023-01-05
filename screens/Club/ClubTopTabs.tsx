import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Animated, DeviceEventEmitter, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ClubHome from "../Club/ClubHome";
import ClubFeed from "../Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../../components/ClubHeader";
import ClubTabBar from "../../components/ClubTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useQuery } from "react-query";
import { Club, ClubApi, ClubResponse, ClubRoleResponse, ClubSchedulesResponse } from "../../api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { RefinedSchedule } from "../../Types/Club";
import moment from "moment-timezone";

const Container = styled.View`
  flex: 1;
`;

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props) => props.height}px;
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

const ModalHeaderRight = styled.View`
  position: absolute;
  right: 15px;
`;

const ModalCloseButton = styled.TouchableOpacity``;

const TopTab = createMaterialTopTabNavigator();

const HEADER_HEIGHT_EXPANDED = 270;
const HEADER_HEIGHT = 100;

const ClubTopTabs = ({
  route: {
    params: { clubData },
  },
  navigation: { navigate, popToTop },
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const me = useSelector((state) => state.UserReducers.user);
  const toast = useToast();
  const [data, setData] = useState<Club>(clubData);
  const [scheduleData, setScheduleData] = useState<RefinedSchedule[]>();
  const [heartSelected, setHeartSelected] = useState<boolean>(false);
  // Header Height Definition
  const { top } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const headerConfig = useMemo(
    () => ({
      heightCollapsed: top + HEADER_HEIGHT,
      heightExpanded: HEADER_HEIGHT_EXPANDED,
    }),
    [top, HEADER_HEIGHT, HEADER_HEIGHT_EXPANDED]
  );
  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed;

  // Animated Variables
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });
  // Function in Modal
  const goClubEdit = () => {
    navigate("ClubManagementStack", {
      screen: "ClubManagementMain",
      clubData: data,
    });
  };

  const goClubJoin = () => {
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

  const goClubNotification = () => {
    navigate("ClubNotification", { clubData: data, clubRole: clubRole?.data });
  };

  const { isLoading: clubLoading, refetch: clubDataRefetch } = useQuery<ClubResponse>(["getClub", token, clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        setData(res.data);
      } else {
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error getClub ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const {
    isLoading: clubRoleLoading,
    data: clubRole,
    refetch: clubRoleRefetch,
  } = useQuery<ClubRoleResponse>(["getClubRole", token, data.id], ClubApi.getClubRole, {
    onSuccess: (res) => {
      if (res.status !== 200 || res.resultCode !== "OK") {
        console.log(`query fail`);
        console.log(`getClubRole status: ${res.status}`);
        console.log(res);
        toast.show("멤버 등급 정보를 불러오지 못했습니다.", {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      toast.show(`Role Request Error: ${error}`, {
        type: "warning",
      });
    },
  });

  const { isLoading: schedulesLoading, refetch: schedulesRefetch } = useQuery<ClubSchedulesResponse>(["getClubSchedules", data.id], ClubApi.getClubSchedules, {
    onSuccess: (res) => {
      if (res.status !== 200) {
        return toast.show(`Schedule Request Error Code: ${res.status}`, {
          type: "warning",
        });
      }

      const week = ["일", "월", "화", "수", "목", "금", "토"];
      const result: RefinedSchedule[] = [];
      for (let i = 0; i < res?.data?.length; ++i) {
        const date = new Date(res?.data[i].startDate);
        const dayOfWeek = week[date.getDay()];
        let refined: RefinedSchedule = {
          id: res.data[i].id,
          location: res.data[i].location,
          name: res.data[i].name,
          members: res.data[i].members,
          startDate: res.data[i].startDate,
          endDate: res.data[i].endDate,
          content: res.data[i].content,
          year: moment(res.data[i].startDate).format("YYYY"),
          month: moment(res.data[i].startDate).format("MM"),
          day: moment(res.data[i].startDate).format("DD"),
          hour: moment(res.data[i].startDate).format("h"),
          minute: moment(res.data[i].startDate).format("m"),
          ampm: moment(res.data[i].startDate).format("A") === "AM" ? "오전" : "오후",
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
      toast.show(`Schedule Request Error: ${error}`, {
        type: "warning",
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log(`${data.id} ClubTopTabs useFocusEffect!`);
      clubDataRefetch();
      clubRoleRefetch();
      schedulesRefetch();
    }, [])
  );

  useEffect(() => {
    console.log("ClubTopTabs - add listner");
    let subscription = DeviceEventEmitter.addListener("SchedulesRefetch", () => {
      console.log("ClubTopTabs - Schedule Refetch Event");
      schedulesRefetch();
    });
    return () => subscription.remove();
  }, []);

  const renderClubHome = useCallback(
    (props) => {
      props.route.params.clubData = data;
      return <ClubHome {...props} scrollY={scrollY} headerDiff={headerDiff} clubRole={clubRole?.data} schedules={scheduleData} />;
    },
    [headerDiff, data, clubRole, scheduleData]
  );
  const renderClubFeed = useCallback((props) => <ClubFeed {...props} scrollY={scrollY} headerDiff={headerDiff} />, [headerDiff]);

  return (
    <Container>
      <StatusBar barStyle={"light-content"} />
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
          <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)} style={{ marginRight: 10 }}>
            {heartSelected ? <Ionicons name="md-heart" size={24} color="white" /> : <Ionicons name="md-heart-outline" size={24} color="white" />}
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
          screenOptions={{
            swipeEnabled: false,
          }}
          tabBar={(props) => <ClubTabBar {...props} />}
          sceneContainerStyle={{ position: "absolute", zIndex: 1 }}
        >
          <TopTab.Screen options={{ tabBarLabel: "모임 정보" }} name="ClubHome" component={renderClubHome} initialParams={{ clubData: data }} />
          <TopTab.Screen options={{ tabBarLabel: "게시물" }} name="ClubFeed" component={renderClubFeed} />
        </TopTab.Navigator>
      </Animated.View>

      {clubRoleLoading ? <></> : <FloatingActionButton role={clubRole?.data?.role} applyStatus={clubRole?.data?.applyStatus} onPressEdit={goClubEdit} onPressJoin={goClubJoin} />}
    </Container>
  );
};

export default ClubTopTabs;
