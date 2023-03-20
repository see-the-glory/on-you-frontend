import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { ErrorResponse, UserApi, UserInfoResponse } from "../api";
import { MaterialCommunityIcons, Feather, MaterialIcons } from "@expo/vector-icons";
import { DeviceEventEmitter, StatusBar } from "react-native";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../components/CustomText";
import CircleIcon from "../components/CircleIcon";
import { RootState } from "../redux/store/reducers";
import { useAppDispatch } from "../redux/store";
import { updateUser } from "../redux/slices/auth";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const UserInfoSection = styled.View`
  background-color: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
  border-bottom-color: #dbdbdb;
  padding: 0px 20px;
  height: 100px;
  flex-direction: row;
  align-items: center;
  elevation: 10;
`;

const InfoBox = styled.View`
  align-items: flex-start;
  justify-content: center;
`;

const Title = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 18px;
  line-height: 24px;
`;

const Email = styled(CustomText)`
  font-size: 14px;
  line-height: 18px;
  color: #878787;
  margin-top: 3px;
  margin-bottom: 5px;
  line-height: 20px;
`;

const MenuWrapper = styled.View`
  margin-top: 3px;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 17px 10px 20px;
  justify-content: center;
  align-items: center;
`;

const MenuItemText = styled(CustomText)`
  color: #2e2e2e;
  font-family: "NotoSansKR-Medium";
  font-size: 16px;
  line-height: 22px;
  margin-left: 10px;
`;

const TouchMenu = styled.View`
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dbdbdb;
  justify-content: center;
`;

const LogoutButton = styled.TouchableOpacity`
  justify-content: center;
  align-self: flex-end;
  width: 76px;
  height: 27px;
  padding-bottom: 2px;
  margin: 13px 22px 10px 0px;
  border-radius: 15px;
  background-color: #000;
`;

const LogoutText = styled(CustomText)`
  text-align: center;
  font-size: 15px;
  line-height: 22px;
  color: #fff;
`;

const ChevronBox = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const EditBox = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  margin-top: 3px;
`;

const EditButton = styled.TouchableWithoutFeedback``;

interface ProfileEditItem {
  icon: React.ReactNode;
  title: string;
  screen?: string;
  onPress?: () => void;
}

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({ navigation: { navigate } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const iconSize = 18;
  const {
    isLoading: userInfoLoading, // true or false
    refetch: userInfoRefetch,
    data: userInfo,
  } = useQuery<UserInfoResponse, ErrorResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      dispatch(updateUser({ user: res.data }));
    },
    onError: (error) => {
      console.log(`API ERROR | getUserInfo ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    let subscription = DeviceEventEmitter.addListener("ProfileRefresh", () => {
      console.log("Profile - Refresh Event");
      userInfoRefetch();
    });
    return () => subscription.remove();
  }, []);

  const goLogout = async () => {
    DeviceEventEmitter.emit("Logout", { fcmToken });
  };

  const goToScreen = (screen?: string) => {
    if (screen) navigate("ProfileStack", { screen });
  };

  const goToEditProfile = () => {
    navigate("ProfileStack", {
      screen: "EditProfile",
      params: userInfo?.data,
    });
  };

  const items: ProfileEditItem[] = [
    {
      icon: <MaterialIcons name="lock" color="#2E2E2E" size={iconSize} />,
      title: "계정",
      screen: "Account",
    },
    {
      icon: <MaterialIcons name="star" color="#2E2E2E" size={iconSize} />,
      title: "나의 모임",
      screen: "MyClubs",
    },
    {
      icon: <MaterialIcons name="notifications" size={iconSize} color="#2E2E2E" />,
      title: "알림 설정",
      screen: "NotificationSetting",
    },
    {
      icon: <MaterialIcons name="textsms" color="#2E2E2E" size={iconSize} />,
      title: "건의사항 요청",
      screen: "Suggestion",
    },
    {
      icon: <MaterialIcons name="info" color="#2E2E2E" size={iconSize} />,
      title: "정보",
      screen: "Info",
    },
  ];

  return (
    <Container>
      <>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <UserInfoSection>
          <CircleIcon size={65} uri={userInfo?.data?.thumbnail} kerning={15} />
          <InfoBox>
            <Email>{userInfo?.data?.email}</Email>
            <Title>{userInfo?.data?.name}</Title>
          </InfoBox>
          <EditBox>
            <EditButton onPress={goToEditProfile}>
              <MaterialCommunityIcons name="pencil-outline" color="#295AF5" size={20} />
            </EditButton>
          </EditBox>
        </UserInfoSection>
        <MenuWrapper>
          {items?.map((item: ProfileEditItem, index: number) => (
            <TouchMenu key={index}>
              <MenuItem onPress={() => goToScreen(item.screen)}>
                {item.icon}
                <MenuItemText>{item.title}</MenuItemText>
                <ChevronBox>
                  <Feather name="chevron-right" color="#CCCCCC" size={22} />
                </ChevronBox>
              </MenuItem>
            </TouchMenu>
          ))}
        </MenuWrapper>

        <LogoutButton onPress={goLogout}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>
      </>
    </Container>
  );
};

export default Profile;
