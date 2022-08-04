import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { Logout } from "../store/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { UserApi, UserInfoResponse } from "../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Box = styled.View`
  background-color: #fff;
  box-shadow: 1px 1px 1px gray;
  padding-horizontal: 20px;
`;

const UserInfoSection = styled.View`
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
  box-shadow: 1px 2px 1px gray;
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

const MenuItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-horizontal: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #dbdbdb;
`;

const MenuItemText = styled.Text`
  color: #2e2e2e;
  font-size: 16px;
`;

const TouchMenu = styled.TouchableOpacity`
  height: 50px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: white;
  height: 50px;
  justify-content: center;
  margin-left: 10px;
`;

const LogoutText = styled.Text`
  text-align: right;
  margin-right: 20px;
`;

const View = styled.View``;

const ChevronBox = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const EditBox = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

// 알아볼 것
// 1. 동기와 비동기 차이
// 2. fetch / axios 차이 알아보기
// 3. react query
// 4. es5 / es6 차이 알아보기

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({ navigation: { navigate } }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);

  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);

  console.log(userInfo);

  const dispatch = useDispatch();

  const goLogout = () => {
    dispatch(Logout());
  };

  const goToEditProfile = () => {
    navigate("ProfileStack", {
      screen: "EditProfile",
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
      <Box>
        <UserInfoSection>
          <LogoBox>
            <LogoImage
              source={{
                uri: userInfo?.data.thumbnail,
              }}
            />
          </LogoBox>
          <InfoBox>
            <Email>{userInfo?.data.email}</Email>
            <Title>{userInfo?.data.name}</Title>
          </InfoBox>
          <EditBox>
            <MaterialCommunityIcons name="pencil-outline" color="#295AF5" size={20} onPress={goToEditProfile} />
          </EditBox>
        </UserInfoSection>
      </Box>
      <MenuWrapper>
        <TouchMenu onPress={goToMyClub}>
          <MenuItem>
            <MaterialCommunityIcons name="star-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>나의 모임</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu onPress={goToNotificationSettings}>
          <MenuItem>
            <MaterialCommunityIcons name="bell-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>알림설정</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu onPress={goToNotice}>
          <MenuItem>
            <MaterialCommunityIcons name="gate-not" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>공지사항</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu onPress={goToHelp}>
          <MenuItem>
            <MaterialCommunityIcons name="comment-question-outline" color="#2E2E2E" size={16} style={{ marginRight: 10 }} />
            <MenuItemText>고객센터/도움말</MenuItemText>
            <ChevronBox>
              <MaterialCommunityIcons name="chevron-right" color="#A0A0A0" size={24} style={{}} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
        <TouchMenu onPress={goToTerms}>
          <MenuItem>
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
