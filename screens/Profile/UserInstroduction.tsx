import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { Profile } from "../../api";
import { Iconify } from "react-native-iconify";
import { lightTheme } from "../../theme";

const Loader = styled.View`
  flex: 1;
  padding-top: 30%;
`;
const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Section = styled.View``;
const Header = styled.View`
  margin-bottom: 10px;
`;
const Content = styled.View``;
const About = styled.View`
  margin-bottom: 10px;
`;
const Personal = styled.View``;
const PersonalItem = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const ClubItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 60px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
`;

const ClubInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ClubInfoDetail = styled.View``;
const ClubInfoDetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ClubCategory = styled.View`
  flex-direction: row;
`;
const ClubRole = styled.View`
  flex-direction: row;
  background-color: black;
  padding: 2px 0px;
  width: 40px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const ClubThumbnail = styled(FastImage)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 20px;
  border: 0.2px solid #c4c4c4;
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 14px;
  line-height: 17px;
`;

const AboutText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #555555;
  font-size: 14px;
`;

const PersonalText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 10px;
  margin-left: 5px;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 16px;
  margin-right: 5px;
`;

const ClubMemberCount = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 12px;
`;

const ClubCategoryText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 10px;
  margin: 1px 0px;
  margin-right: 5px;
  color: #808080;
`;

const ClubRoleText = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontR};
  font-size: 10px;
  line-height: 13px;
  color: white;
`;

interface UserInstroductionProps {
  profile?: Profile;
}

const UserInstroduction: React.FC<UserInstroductionProps> = ({ profile }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goToClub = (clubId: number) => navigation.push("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: clubId } } });
  return !profile ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <Section>
        <Header>
          <HeaderTitle>{`인사`}</HeaderTitle>
        </Header>
        <Content>
          <About>
            <AboutText>{profile?.about ?? "인사말이 없습니다."}</AboutText>
          </About>
          <Personal>
            {profile?.emailPublic ? (
              <PersonalItem>
                <Iconify icon="pepicons-pencil:letter" size={14} color="#C4C4C4" />
                <PersonalText>{profile?.email}</PersonalText>
              </PersonalItem>
            ) : null}
            {profile?.contactPublic ? (
              <PersonalItem>
                <Iconify icon="material-symbols:call" size={14} color="#C4C4C4" />
                <PersonalText>{profile?.contact}</PersonalText>
              </PersonalItem>
            ) : null}
            {profile?.birthdayPublic ? (
              <PersonalItem>
                <Iconify icon="ic:outline-cake" size={14} color="#C4C4C4" />
                <PersonalText>{profile?.birthday}</PersonalText>
              </PersonalItem>
            ) : null}
          </Personal>
        </Content>
      </Section>
      <Section style={{ marginTop: 15 }}>
        <Header>
          <HeaderTitle>{`내 모임`}</HeaderTitle>
        </Header>
        <Content>
          {profile?.clubs?.map((club) => (
            <ClubItem key={`Club_${club.id}`} onPress={() => goToClub(club.id)}>
              <ClubThumbnail source={club.thumbnail ? { uri: club.thumbnail } : require("../../assets/basic.jpg")} />
              <ClubInfo>
                <ClubInfoDetail>
                  <ClubInfoDetailHeader>
                    <ClubNameText>{club.name}</ClubNameText>
                    <Iconify icon="ant-design:user-outlined" size={14} color={lightTheme.accentColor} />
                    <ClubMemberCount>{` ${club.recruitNumber}`}</ClubMemberCount>
                  </ClubInfoDetailHeader>
                  <ClubCategory>
                    {club.categories?.map((category) => (
                      <ClubCategoryText key={`Category_${category.id}`}>{`#${category.name}`}</ClubCategoryText>
                    ))}
                  </ClubCategory>
                </ClubInfoDetail>
                {["MASTER", "MANAGER"].includes(club.role ?? "") ? (
                  club.role === "MASTER" ? (
                    <ClubRole>
                      <Iconify icon="ph:star-fill" size={10} color="white" />
                      <ClubRoleText>{" LD"}</ClubRoleText>
                    </ClubRole>
                  ) : (
                    <ClubRole>
                      <Iconify icon="fluent-mdl2:skype-check" size={10} color="white" />
                      <ClubRoleText>{" MG"}</ClubRoleText>
                    </ClubRole>
                  )
                ) : null}
              </ClubInfo>
            </ClubItem>
          ))}
        </Content>
      </Section>
    </Container>
  );
};

export default UserInstroduction;
