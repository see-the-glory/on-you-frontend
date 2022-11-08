import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { Logout } from "../store/Actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { UserApi, UserInfoResponse, ClubApi, CategoryResponse } from "../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const UserInfoSection = styled.View`
  background-color: #fff;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.25);
  padding-horizontal: 20px;
  height: 100px;
  flex-direction: row;
  align-items: center;
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
  padding-top: 15px;
  padding-bottom: 15px;
  padding-horizontal: 20px;
`;

const MenuItemText = styled.Text`
  color: #2e2e2e;
  font-size: 16px;
`;

const TouchMenu = styled.View`
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dbdbdb;
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

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({ navigation: { navigate } }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);

  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);

  const dispatch = useDispatch();

  const goLogout = () => {
    dispatch(Logout());
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

  const goToNotificationSettings = () => {
    navigate("ProfileStack", {
      screen: "NotificationSettings",
    });
  };

  const goToNotice = () => {
    navigate("ProfileStack", {
      screen: "Notice",
    });
  };
  const goToHelp = () => {
    navigate("ProfileStack", {
      screen: "Help",
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
        <LogoBox>
          <LogoImage
            source={{
              uri: userInfo?.data?.thumbnail,
            }}
          />
        </LogoBox>
        <InfoBox>
          <Email>{userInfo?.data?.email}</Email>
          <Title>{userInfo?.data?.name}</Title>
        </InfoBox>
        <EditBox>
          <MaterialCommunityIcons name="pencil-outline" color="#295AF5" size={20} onPress={goToEditProfile} />
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
          <MenuItem onPress={goToNotificationSettings}>
            <MaterialCommunityIcons name="bell-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>알림설정</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu>
          <MenuItem onPress={goToNotice}>
            <MaterialCommunityIcons name="gate-not" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>공지사항</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu>
          <MenuItem onPress={goToHelp}>
            <MaterialCommunityIcons name="comment-question-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>고객센터/도움말</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
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
