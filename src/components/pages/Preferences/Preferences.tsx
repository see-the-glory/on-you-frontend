import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { ErrorResponse, UserApi, UserInfoResponse } from "api";
import { Entypo } from "@expo/vector-icons";
import { DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import CircleIcon from "@components/atoms/CircleIcon";
import { RootState } from "redux/store/reducers";
import { useAppDispatch } from "redux/store";
import { updateUser } from "redux/slices/auth";
import { ProfileStackParamList } from "@navigation/ProfileStack";
import { setUserProperties } from "app/analytics";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;
const Header = styled.TouchableOpacity`
  margin: 10px 20px;
  padding: 18px;
  background-color: #f5f5f5;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserInfo = styled.View`
  align-items: flex-start;
  justify-content: center;
`;

const UserInfoName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 18px;
  line-height: 24px;
`;

const UserInfoEmail = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #7d7d7d;
`;

const Content = styled.View`
  padding: 20px;
`;

const MenuBundle = styled.View`
  margin-bottom: 15px;
`;

const MenuBundleTitle = styled.Text`
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 14px;
  line-height: 20px;
  color: #8e8e8e;
  margin-bottom: 13px;
`;

const MenuButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
`;
const MenuTitle = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 16px;
  line-height: 17px;
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

const LogoutText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  text-align: center;
  font-size: 15px;
  line-height: 22px;
  color: white;
`;

const EditBox = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  margin-top: 3px;
`;

const EditButton = styled.TouchableWithoutFeedback``;

interface ProfileEditBundle {
  title: string;
  items: ProfileEditItem[];
}

interface ProfileEditItem {
  title: string;
  screen?: string;
  onPress?: () => void;
}

const Preferences: React.FC<NativeStackScreenProps<ProfileStackParamList, "Preferences">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const {
    isLoading: userInfoLoading, // true or false
    refetch: userInfoRefetch,
    data: userInfo,
  } = useQuery<UserInfoResponse, ErrorResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      setUserProperties(res.data.id, res.data.birthday, res.data.sex, res.data.organizationName);
      dispatch(updateUser({ user: res.data }));
    },
    onError: (error) => {
      console.log(`API ERROR | getUserInfo ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });

    const subscription = DeviceEventEmitter.addListener("ProfileRefresh", () => {
      userInfoRefetch();
    });
    return () => subscription.remove();
  }, []);

  const goLogout = async () => {
    DeviceEventEmitter.emit("Logout", {});
  };

  const goToScreen = (screen?: "MyClubs" | "AccountSetting" | "NotificationSetting" | "Suggestion" | "Info") => {
    if (screen) navigate(screen);
  };

  const goToAccountEdit = () => {
    navigate("AccountEdit", { userData: userInfo?.data });
  };

  const itemBundle: ProfileEditBundle[] = [
    {
      title: "나의 활동",
      items: [
        {
          title: "나의 모임 관리",
          screen: "MyClubs",
        },
      ],
    },
    {
      title: "설정",
      items: [
        {
          title: "계정",
          screen: "AccountSetting",
        },
        {
          title: "알림 설정",
          screen: "NotificationSetting",
        },
      ],
    },
    {
      title: "기타",
      items: [
        {
          title: "건의사항 요청",
          screen: "Suggestion",
        },
        {
          title: "정보",
          screen: "Info",
        },
      ],
    },
  ];

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header onPress={goToAccountEdit}>
        <CircleIcon size={55} uri={userInfo?.data?.thumbnail} kerning={15} />
        <UserInfo>
          <UserInfoName>{userInfo?.data?.name}</UserInfoName>
          <UserInfoEmail>{userInfo?.data?.email}</UserInfoEmail>
        </UserInfo>
        <EditBox>
          <Entypo name="chevron-thin-right" size={20} color="#CFCFCF" />
        </EditBox>
      </Header>
      <Content>
        {itemBundle?.map((bundle: ProfileEditBundle, index: number) => (
          <MenuBundle key={`Bundle_${index}`}>
            <MenuBundleTitle>{bundle.title}</MenuBundleTitle>
            {bundle.items.map((item: ProfileEditItem, index: number) => (
              <MenuButton key={`Item_${index}`} onPress={() => goToScreen(item.screen)}>
                <MenuTitle>{item.title}</MenuTitle>
                <Entypo name="chevron-thin-right" size={20} color="#CFCFCF" />
              </MenuButton>
            ))}
          </MenuBundle>
        ))}
      </Content>
      <LogoutButton onPress={goLogout}>
        <LogoutText>{`로그아웃`}</LogoutText>
      </LogoutButton>
    </Container>
  );
};

export default Preferences;
