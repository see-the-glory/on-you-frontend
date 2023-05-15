import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { Profile } from "../../api";

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
  width: 350px;
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
  background-color: black;
  padding: 2px 6px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const ClubThumbnail = styled(FastImage)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 20px;
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
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 16px;
  line-height: 19px;
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
  const navigation = useNavigation();
  const goToClub = (clubId: number) => navigation.navigate("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: clubId } } });
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
            {!profile?.emailPublic ? (
              <PersonalItem>
                <PersonalText>{profile?.email}</PersonalText>
              </PersonalItem>
            ) : null}
            {!profile?.contactPublic ? (
              <PersonalItem>
                <PersonalText>{profile?.contact}</PersonalText>
              </PersonalItem>
            ) : null}
            {!profile?.birthdayPublic ? (
              <PersonalItem>
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
          {profile?.clubs.map((club) => (
            <ClubItem key={`Club_${club.id}`} onPress={() => goToClub(club.id)}>
              <ClubThumbnail source={club.thumbnail ? { uri: club.thumbnail } : require("../../assets/basic.jpg")} />
              <ClubInfo>
                <ClubInfoDetail>
                  <ClubInfoDetailHeader>
                    <ClubNameText>{club.name}</ClubNameText>
                    <ClubMemberCount>{club.recruitNumber}</ClubMemberCount>
                  </ClubInfoDetailHeader>
                  <ClubCategory>
                    {club.categories?.map((category) => (
                      <ClubCategoryText key={`Category_${category.id}`}>{`#${category.name}`}</ClubCategoryText>
                    ))}
                  </ClubCategory>
                </ClubInfoDetail>
                {["MASTER", "MANAGER"].includes(club.role ?? "") ? (
                  <ClubRole>
                    <ClubRoleText>{club.role === "MASTER" ? "LD" : "MG"}</ClubRoleText>
                  </ClubRole>
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
