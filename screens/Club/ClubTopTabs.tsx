import React, { useState, useRef, useCallback, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Animated, Platform, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ClubHome from "../Club/ClubHome";
import ClubFeed from "../Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../../components/ClubHeader";
import ClubTabBar from "../../components/ClubTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Club, ClubApi, ClubApplyRequest, ClubResponse, ClubRoleResponse, ClubSchedulesResponse } from "../../api";
import { useSelector } from "react-redux";
import ClubJoinModal from "./ClubJoinModal";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";

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
  navigation,
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const toast = useToast();
  const [data, setData] = useState<Club>(clubData);
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
  const clubEdit = () => {
    return navigation.navigate("ClubManagementStack", {
      screen: "ClubManagementMain",
      clubData: data,
    });
  };

  const clubJoin = () => {
    if (clubRole?.data?.applyStatus === "APPLIED") {
      toast.show("가입신청서가 이미 전달되었습니다.", {
        type: "warning",
      });
    } else {
      navigation.navigate("ClubJoin", { clubData: data });
    }
  };

  const { refetch: clubDataRefetch } = useQuery<ClubResponse>(["getClub", token, clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        setData(res.data);
        console.log(`${res.data.id} contactPhone: ${res.data.contactPhone}`);
      } else {
        toast.show(`Error Code: ${res.status}`, {
          type: "error",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error getClub ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "error",
      });
    },
  });

  const {
    isLoading: clubRoleLoading,
    data: clubRole,
    refetch: clubRoleRefetch,
  } = useQuery<ClubRoleResponse>(["getClubRole", token, data.id], ClubApi.getClubRole, {
    onSuccess: (res) => {},
    onError: (error) => {
      toast.show(`Role Request Error: ${error}`, {
        type: "error",
      });
    },
  });

  const { isLoading: schedulesLoading, data: schedules } = useQuery<ClubSchedulesResponse>(["getClubSchedules", data.id], ClubApi.getClubSchedules, {
    onSuccess: (res) => {
      if (res.status !== 200) {
        toast.show(`Schedule Request Error Code: ${res.status}`, {
          type: "error",
        });
      }
    },
    onError: (error) => {
      toast.show(`Schedule Request Error: ${error}`, {
        type: "error",
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log(`${data.id} ClubTopTabs useFocusEffect!`);
      clubDataRefetch();
      clubRoleRefetch();
    }, [])
  );

  const renderClubHome = useCallback(
    (props) => {
      props.route.params.clubData = data;
      return <ClubHome {...props} scrollY={scrollY} headerDiff={headerDiff} clubRole={clubRole?.data} />;
    },
    [headerDiff, data, clubRole]
  );
  const renderClubFeed = useCallback((props) => <ClubFeed {...props} scrollY={scrollY} headerDiff={headerDiff} />, [headerDiff]);

  return (
    <Container>
      <StatusBar barStyle={"light-content"} />
      <NavigationView height={HEADER_HEIGHT}>
        <LeftNavigationView>
          <TouchableOpacity onPress={() => navigation.popToTop()}>
            <Entypo name="chevron-thin-left" size={20} color="white" />
          </TouchableOpacity>
        </LeftNavigationView>
        <RightNavigationView>
          <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)} style={{ marginRight: 10 }}>
            {heartSelected ? <Ionicons name="md-heart" size={20} color="white" /> : <Ionicons name="md-heart-outline" size={24} color="white" />}
          </TouchableOpacity>
        </RightNavigationView>
      </NavigationView>

      <ClubHeader
        imageURI={data.thumbnail}
        name={data.name}
        shortDesc={data.clubShortDesc}
        categories={data.categories}
        recruitStatus={data.recruitStatus}
        schedules={schedules?.data}
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

      {clubRoleLoading ? <></> : <FloatingActionButton role={clubRole?.data?.role} applyStatus={clubRole?.data?.applyStatus} onPressEdit={clubEdit} onPressJoin={clubJoin} />}
    </Container>
  );
};

export default ClubTopTabs;
