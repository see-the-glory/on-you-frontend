import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { UserApi, UserInfoResponse } from "../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DeviceEventEmitter } from "react-native";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../components/CustomText";
import CircleIcon from "../components/CircleIcon";
import { RootState } from "../redux/store/reducers";
import { useAppDispatch } from "../redux/store";
import { logout, updateUser } from "../redux/slices/auth";

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

const LogoBox = styled.View`
  width: 65px;
  height: 65px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgb(255, 255, 255);
  background-color: white;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
`;

const LogoImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 100px;
  z-index: 1;
`;

const InfoBox = styled.View`
  align-items: flex-start;
  justify-content: center;
  margin-left: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000;
`;

const Email = styled.Text`
  font-size: 11px;
  font-weight: normal;
  color: #878787;
  margin-bottom: 5px;
`;

const MenuWrapper = styled.View`
  margin-top: 3px;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
`;

const MenuItemText = styled(CustomText)`
  color: #2e2e2e;
  font-family: "NotoSansKR-Medium";
  font-size: 16px;
  line-height: 22px;
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
  width: 80px;
  height: 30px;
  margin-top: 10px;
  margin-right: 25px;
  border-radius: 15px;
  background-color: #000;
`;

const LogoutText = styled.Text`
  text-align: center;
  font-size: 16px;
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
`;

const EditButton = styled.TouchableWithoutFeedback``;

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({ navigation: { navigate } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    isLoading: userInfoLoading, // true or false
    refetch: userInfoRefetch,
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        dispatch(updateUser({ user: res.data }));
      } else {
        console.log(`getUserInfo success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`유저 정보를 불러오지 못했습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error getUserInfo ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  useEffect(() => {
    let subscription = DeviceEventEmitter.addListener("ProfileRefresh", () => {
      console.log("Profile - Refresh Event");
      userInfoRefetch();
    });
    return () => subscription.remove();
  }, []);

  const goLogout = () => {
    dispatch(logout());
  };

  const goToEditProfile = () => {
    navigate("ProfileStack", {
      screen: "EditProfile",
      params: userInfo?.data,
    });
  };

  const goToMyClub = () => {
    navigate("ProfileStack", {
      screen: "MyClub",
    });
  };

  const goToChangePw = () => {
    navigate("ProfileStack", {
      screen: "ChangePw",
    });
  };

  const goToTerms = () => {
    navigate("ProfileStack", {
      screen: "Terms",
    });
  };

  return (
    <Container>
      <UserInfoSection>
        <CircleIcon size={65} uri={userInfo?.data?.thumbnail} />
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
        <TouchMenu>
          <MenuItem onPress={goToMyClub}>
            <MaterialCommunityIcons name="star-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>나의 모임</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu>
          <MenuItem onPress={goToChangePw}>
            <MaterialCommunityIcons name="bell-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>비밀번호 재설정</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        {/* 
        <TouchMenu>
          <MenuItem onPress={goToHelp}>
            <MaterialCommunityIcons name="comment-question-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>고객센터/도움말</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu> */}
        <TouchMenu>
          <MenuItem onPress={goToTerms}>
            <MaterialCommunityIcons name="file-document-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>약관</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
      </MenuWrapper>

      <LogoutButton onPress={goLogout}>
        <LogoutText>Logout</LogoutText>
      </LogoutButton>
    </Container>
  );
};

export default Profile;
