import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform, Switch, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { Club } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import { lightTheme } from "../../theme";
import ImagePicker from "react-native-image-crop-picker";
import BottomButton from "../../components/BottomButton";
import { Entypo } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  width: 100%;
  height: 300px;
`;

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
  padding-left: 16px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 16px;
`;

const FilterView = styled.View`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ImageChangeText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontL};
  color: #dedede;
  font-size: 14px;
  margin: 20px 0px 35px 0px;
`;

const BackgroundChangeButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;

const Content = styled.View`
  padding-top: 20px;
  padding-bottom: 100px;
`;

const Section = styled.View`
  padding: 0px 20px;
  margin-bottom: 25px;
`;
const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SectionContent = styled.View``;

const AboutTextInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  width: 100%;
  height: 120px;
  background-color: #f8f8f8;
  font-size: 14px;
  padding: 10px;
  margin-top: 10px;
`;

const PersonalItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0px;
  border-bottom-color: #dddddd;
  border-bottom-width: 0.5px;
`;
const PersonalInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PersonalInfoTitle = styled.Text`
  width: 50px;
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

const ClubItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0px;
  border-bottom-color: #dddddd;
  border-bottom-width: 0.5px;
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
  margin-right: 10px;
  border: 0.2px solid #c4c4c4;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 14px;
  margin-right: 5px;
`;

const ClubMemberCount = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  color: #c4c4c4;
  font-size: 12px;
`;

const ClubCategoryText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 11px;
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

const SectionContentSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #bcbcbc;
  font-size: 11px;
  margin-top: 10px;
`;

const enum IMAGE_TYPE {
  THUMBNAIL = "thunbmail",
  BACKGROUND = "background",
}

const HEADER_HEIGHT = 56;

const ProfileEdit: React.FC<NativeStackScreenProps<any, "ProfileEdit">> = ({
  route: {
    params: { profile },
  },
  navigation: { navigate, push, goBack, setOptions },
}) => {
  const [about, setAbout] = useState<string>(profile?.about ?? "");
  const [thumbnail, setThumbnail] = useState<string | undefined>(profile?.thumbnail ?? undefined);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(profile?.backgroundImage ?? undefined);

  const [emailPublic, setEmailPublic] = useState<boolean>(profile?.emailPublic ?? false);
  const [contactPublic, setContactPublic] = useState<boolean>(profile?.contactPublic ?? false);
  const [birthdayPublic, setBirthdayPublic] = useState<boolean>(profile?.birthdayPublic ?? false);
  const [clubPublic, setClubPublic] = useState<boolean>(profile?.clubPublic ?? false);
  const [feedPublic, setFeedPublic] = useState<boolean>(profile?.feedPublic ?? false);
  const { top } = useSafeAreaInsets();

  const pickImage = async (type: IMAGE_TYPE) => {
    try {
      let image = await ImagePicker.openPicker({ mediaType: "photo" });
      let croped = await ImagePicker.openCropper({
        mediaType: "photo",
        path: image.path,
        width: 1080,
        height: 1080,
        cropperCancelText: "취소",
        cropperChooseText: "선택",
        cropperToolbarTitle: "이미지를 크롭하세요.",
        forceJpg: true,
      });

      if (croped) {
        if (type === IMAGE_TYPE.THUMBNAIL) setThumbnail(croped.path);
        else if (type === IMAGE_TYPE.BACKGROUND) setBackgroundImage(croped.path);
      }
    } catch (e) {}
  };

  const onSubmit = () => {};

  return (
    <Container>
      <Header>
        <NavigationView height={HEADER_HEIGHT} style={{ marginTop: top }}>
          <LeftNavigationView>
            <TouchableOpacity onPress={goBack}>
              <Entypo name="chevron-thin-left" size={20} color="white" />
            </TouchableOpacity>
          </LeftNavigationView>
          <RightNavigationView></RightNavigationView>
        </NavigationView>
        <FastImage style={{ width: "100%", height: "100%" }} source={backgroundImage ? { uri: backgroundImage } : require("../../assets/basic.jpg")}>
          <FilterView>
            <BackgroundChangeButton activeOpacity={1} onPress={() => pickImage(IMAGE_TYPE.BACKGROUND)}>
              <CircleIcon uri={thumbnail} size={140} onPress={() => pickImage(IMAGE_TYPE.THUMBNAIL)} />
              <ImageChangeText>{`이미지 영역을 터치해 수정해 보세요.`}</ImageChangeText>
            </BackgroundChangeButton>
          </FilterView>
        </FastImage>
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
                onValueChange={() => setEmailPublic((prev) => !prev)}
                value={emailPublic}
                style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [], marginRight: -5 }}
              />
            </PersonalItem>
            <PersonalItem>
              <PersonalInfo>
                <PersonalInfoTitle>{`연락처`}</PersonalInfoTitle>
                <PersonalInfoText>{profile?.contact}</PersonalInfoText>
              </PersonalInfo>
              <Switch
                trackColor={{ false: "#D4D4D4", true: lightTheme.accentColor }}
                thumbColor={"white"}
                onValueChange={() => setContactPublic((prev) => !prev)}
                value={contactPublic}
                style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [], marginRight: -5 }}
              />
            </PersonalItem>
            <PersonalItem style={{ borderBottomWidth: 0 }}>
              <PersonalInfo>
                <PersonalInfoTitle>{`생일`}</PersonalInfoTitle>
                <PersonalInfoText>{profile?.birthday}</PersonalInfoText>
              </PersonalInfo>
              <Switch
                trackColor={{ false: "#D4D4D4", true: lightTheme.accentColor }}
                thumbColor={"white"}
                onValueChange={() => setBirthdayPublic((prev) => !prev)}
                value={birthdayPublic}
                style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [], marginRight: -5 }}
              />
            </PersonalItem>
            <SectionContentSubText>{`정보 변경은 마이페이지 > 설정 > 프로필카드 에서 수정할 수 있습니다.`}</SectionContentSubText>
          </SectionContent>
        </Section>
        <Section>
          <SectionHeader>
            <HeaderTitle>{`내 모임`}</HeaderTitle>
            <HeaderText>{`공개여부`}</HeaderText>
          </SectionHeader>
          <SectionContent>
            {profile?.clubs.map((club: Club, index: number) => (
              <ClubItem key={`Club_${club.id}`} style={index === profile?.clubs?.length - 1 ? { borderBottomWidth: 0 } : {}}>
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
            <SectionContentSubText>{`비공개로 설정된 모임은 작성된 게시물도 함께 비공개 됩니다.`}</SectionContentSubText>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <HeaderTitle>{`작성한 피드`}</HeaderTitle>
            <HeaderText>{`공개여부`}</HeaderText>
          </SectionHeader>
          <SectionContent>
            <PersonalItem style={{ borderBottomWidth: 0 }}>
              <PersonalInfo>
                <PersonalInfoTitle style={{ width: 100 }}>{`나의 게시물`}</PersonalInfoTitle>
              </PersonalInfo>
              <Switch
                trackColor={{ false: "#D4D4D4", true: lightTheme.accentColor }}
                thumbColor={"white"}
                onValueChange={() => setFeedPublic((prev) => !prev)}
                value={feedPublic}
                style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [], marginRight: -5 }}
              />
            </PersonalItem>
            <SectionContentSubText>{`비공개 설정 시 마이페이지 게시물 탭에서 본인에게만 피드가 보여집니다.`}</SectionContentSubText>
          </SectionContent>
        </Section>
      </Content>
      <BottomButton onPress={onSubmit} title={"저장"} backgroundColor={lightTheme.accentColor} />
    </Container>
  );
};

export default ProfileEdit;
