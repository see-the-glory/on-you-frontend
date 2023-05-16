import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions, StatusBar, Animated, Platform } from "react-native";
import { useModalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ErrorResponse, ProfileResponse, UserApi } from "../../api";
import ProfileHeader from "../../components/ProfileHeader";
import TabBar from "../../components/TabBar";
import { RootState } from "../../redux/store/reducers";
import ProfileOptionModal from "./ProfileOptionModal";
import UserFeed from "./UserFeed";
import UserInstroduction from "./UserInstroduction";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import Share from "react-native-share";
import ProfileReportModal from "./ProfileReportModal";
import { useFocusEffect } from "@react-navigation/native";
import { lightTheme } from "../../theme";

const Container = styled.View`
  flex: 1;
`;

const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_HEIGHT = 56;
const TAB_BAR_HEIGHT = 46;

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({
  route: {
    params: { userId },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const TopTab = createMaterialTopTabNavigator();
  const me = useSelector((state: RootState) => state.auth.user);
  const isMe = !userId || userId === me?.id ? true : false;
  const toast = useToast();
  const { ref: profileOptionRef, open: openProfileOption, close: closeProfileOption } = useModalize();
  const { ref: profileReportRef, open: openProfileReport, close: closeProfileReport } = useModalize();
  const modalOptionButtonHeight = 45;

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

  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });

  const screenScrollRefs = useRef<any>({});

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: profileRefetch,
  } = useQuery<ProfileResponse, ErrorResponse>(userId ? ["getProfile", userId] : ["getMyProfile"], userId ? UserApi.getProfile : UserApi.getMyProfile, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      console.log(`API ERROR | getProfile ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const renderUserInstroduction = useCallback(
    (props: any) => {
      return (
        <Animated.ScrollView
          ref={(ref: any) => {
            screenScrollRefs.current["UserInstroduction"] = ref;
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerDiff],
                  outputRange: [-headerDiff, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          contentContainerStyle={{
            paddingTop: headerDiff,
            paddingBottom: headerDiff,
            minHeight: SCREEN_HEIGHT + headerDiff,
            backgroundColor: "white",
          }}
        >
          <UserInstroduction profile={profile?.data} />
        </Animated.ScrollView>
      );
    },
    [headerDiff, profile]
  );

  const goToPreferences = () => {
    navigate("Preferences");
  };

  const goToEditProfile = () => {};

  const openReportModal = () => {
    closeProfileOption();
    openProfileReport();
  };

  const openOptionModal = () => {
    openProfileOption();
  };

  const openShareProfile = async () => {
    if (userId === undefined && (me?.id === undefined || me?.id === null)) {
      toast.show(`공유 링크 생성에 실패했습니다.`, { type: "warning" });
      return;
    }
    closeProfileOption();
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://onyou.page.link/user?id=${userId ?? me?.id}`,
        domainUriPrefix: "https://onyou.page.link",
        android: { packageName: "com.onyoufrontend" },
        ios: { bundleId: "com.onyou.project", appStoreId: "1663717005" },
        otherPlatform: { fallbackUrl: "https://thin-helium-f6d.notion.site/e33250ceb44c428cb881d6ac7d163e69" },
        social: {
          title: profile?.data.name ?? "",
          descriptionText: profile?.data.about ?? "",
          imageUrl: profile?.data.thumbnail ?? "",
        },

        // navigation: { forcedRedirectEnabled: true }, // iOS에서 preview page를 스킵하는 옵션. 이걸 사용하면 온유앱이 꺼져있을 때는 제대로 navigation이 되질 않는 버그가 있음.
      },
      dynamicLinks.ShortLinkType.SHORT
    );

    const title = profile?.data.name ?? "";
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
  };

  useFocusEffect(() => {
    // Android만 지원
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  });

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <ProfileHeader
        isMe={isMe}
        profile={profile?.data}
        headerHeight={HEADER_HEIGHT}
        tabBarHeight={TAB_BAR_HEIGHT}
        heightExpanded={heightExpanded}
        heightCollapsed={heightCollapsed}
        headerDiff={headerDiff}
        scrollY={scrollY}
        goToPreferences={goToPreferences}
        goToEditProfile={goToEditProfile}
        openOptionModal={openOptionModal}
        openShareProfile={openShareProfile}
      />

      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          zIndex: 2,
          flex: 1,
          width: "100%",
          height: SCREEN_HEIGHT + HEADER_EXPANDED_HEIGHT - HEADER_HEIGHT,
          paddingTop: heightExpanded,
          transform: [{ translateY }],
        }}
      >
        <TopTab.Navigator
          initialRouteName="UserInstroduction"
          screenOptions={{ swipeEnabled: false }}
          tabBar={(props) => <TabBar {...props} height={TAB_BAR_HEIGHT} rounding={true} focusColor={lightTheme.accentColor} />}
          sceneContainerStyle={{ position: "absolute", zIndex: 1 }}
        >
          <TopTab.Screen options={{ tabBarLabel: "소개" }} name="UserInstroduction" component={renderUserInstroduction} />
          <TopTab.Screen options={{ tabBarLabel: "작성한 피드" }} name="UserFeed" component={UserFeed} />
        </TopTab.Navigator>
      </Animated.View>

      <ProfileOptionModal
        modalRef={profileOptionRef}
        userId={userId}
        userName={profile?.data.name}
        buttonHeight={modalOptionButtonHeight}
        openShareProfile={openShareProfile}
        openReportModal={openReportModal}
      />

      <ProfileReportModal modalRef={profileReportRef} userId={userId} userName={profile?.data.name} buttonHeight={modalOptionButtonHeight} />
    </Container>
  );
};

export default Profile;
