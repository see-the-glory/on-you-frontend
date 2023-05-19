import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform, Switch } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { lightTheme } from "../../theme";

const Container = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  width: 100%;
  height: 300px;
  background-color: orange;
`;

const Content = styled.View``;

const Section = styled.View`
  margin-top: 20px;
  padding: 0px 20px;
`;
const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SectionContent = styled.View`
  margin: 5px 0px;
`;

const AboutTextInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  width: 100%;
  height: 120px;
  background-color: #f8f8f8;
  font-size: 14px;
  padding: 10px;
`;

const PersonalItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const PersonalInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PersonalInfoTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 12px;
  color: #020202;
`;
const PersonalInfoText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 13px;
  color: #808080;
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 14px;
  line-height: 17px;
`;
const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  color: #2b2b2b;
  font-size: 10px;
`;
const HeaderSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #bcbcbc;
  font-size: 10px;
`;

const ProfileEdit: React.FC<NativeStackScreenProps<any, "ProfileEdit">> = ({
  route: {
    params: { profile },
  },
  navigation: { navigate, push, goBack },
}) => {
  const [about, setAbout] = useState<string>(profile?.about ?? "");

  console.log(profile);
  return (
    <Container>
      <Header>
        <FastImage style={{ width: "100%", height: "100%" }} source={profile?.backgroundImage ? { uri: profile?.backgroundImage } : require("../../assets/basic.jpg")} />
      </Header>
      <Content>
        <Section>
          <SectionHeader>
            <HeaderTitle>{`인사`}</HeaderTitle>
            <HeaderSubText>{`${about.length}/200 자`}</HeaderSubText>
          </SectionHeader>
          <SectionContent>
            <AboutTextInput
              value={about}
              placeholder="자신을 소개해주세요."
              placeholderTextColor="#B0B0B0"
              textAlign="left"
              multiline={true}
              maxLength={200}
              textAlignVertical="top"
              onChangeText={(text: string) => setAbout(text)}
              onEndEditing={() => setAbout((prev) => prev.trim())}
              includeFontPadding={false}
            />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <HeaderTitle>{`정보`}</HeaderTitle>
            <HeaderText>{`공개여부`}</HeaderText>
          </SectionHeader>
          <SectionContent>
            <PersonalItem>
              <PersonalInfo>
                <PersonalInfoTitle>{`이메일`}</PersonalInfoTitle>
                <PersonalInfoText>{profile?.email}</PersonalInfoText>
              </PersonalInfo>

              <Switch
                trackColor={{ false: "#D4D4D4", true: lightTheme.accentColor }}
                thumbColor={"white"}
                onValueChange={() => {}}
                // value={userPush}
                style={Platform.OS === "ios" ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}}
              />
            </PersonalItem>
            <PersonalItem>
              <PersonalInfo>
                <PersonalInfoTitle>{`연락처`}</PersonalInfoTitle>
                <PersonalInfoText>{profile?.contact}</PersonalInfoText>
              </PersonalInfo>
            </PersonalItem>
            <PersonalItem>
              <PersonalInfo>
                <PersonalInfoTitle>{`생일`}</PersonalInfoTitle>
                <PersonalInfoText>{profile?.birthday}</PersonalInfoText>
              </PersonalInfo>
            </PersonalItem>
          </SectionContent>
        </Section>
      </Content>
    </Container>
  );
};

export default ProfileEdit;
