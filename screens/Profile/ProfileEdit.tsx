import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import { Animated, Image, Platform, Switch, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { BaseResponse, Club, ErrorResponse, ProfileResponse, ProfileUpdateRequest, UserApi } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import { lightTheme } from "../../theme";
import ImagePicker from "react-native-image-crop-picker";
import BottomButton from "../../components/BottomButton";
import { Entypo } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { Iconify } from "react-native-iconify";

const Container = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  width: 100%;
  height: 300px;
  background-color: white;
`;

const NavigationView = styled.View<{ height: number }>`
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
const CenterNavigationView = styled.View`
  flex-direction: row;
`;

const NavigationTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 16px;
  color: #2b2b2b;
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
  font-size: 13px;
  color: #020202;
`;
const PersonalInfoText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 14px;
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
  margin-right: 10px;
  border: 0.2px solid #c4c4c4;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 15px;
  margin-right: 5px;
`;

const ClubMemberCount = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  color: #c4c4c4;
  font-size: 12px;
  margin-bottom: 1px;
`;

const ClubCategoryText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
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
  font-size: 11px;
`;
const HeaderSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #bcbcbc;
  font-size: 11px;
`;

const SectionContentSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #bcbcbc;
  font-size: 12px;
  margin-top: 10px;
`;

const enum IMAGE_TYPE {
  THUMBNAIL = "thunbmail",
  BACKGROUND = "background",
}

const ProfileEdit: React.FC<NativeStackScreenProps<any, "ProfileEdit">> = ({
  route: {
    params: { profile, headerHeight },
  },
  navigation: { navigate, push, goBack, setOptions },
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [about, setAbout] = useState<string>(profile?.about ?? "");
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [isEmailPublic, setIsEmailPublic] = useState<"Y" | "N">(profile?.isEmailPublic ?? "N");
  const [isContactPublic, setIsContactPublic] = useState<"Y" | "N">(profile?.isContactPublic ?? "N");
  const [isBirthdayPublic, setIsBirthdayPublic] = useState<"Y" | "N">(profile?.isBirthdayPublic ?? "N");
  const [isClubPublic, setIsClubPublic] = useState<"Y" | "N">(profile?.isClubPublic ?? "N");
  const [isFeedPublic, setIsFeedPublic] = useState<"Y" | "N">(profile?.isFeedPublic ?? "N");
  const { top } = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeIn = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [-1, 1],
  });
  const bgColor = scrollY.interpolate({
    inputRange: [70, 100],
    outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
  });

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

  const profileMutation = useMutation<ProfileResponse, ErrorResponse, ProfileUpdateRequest>(UserApi.updateMyProfile, {
    onSuccess: (res) => {
      toast.show("저장에 성공하였습니다.", { type: "success" });
      queryClient.setQueryData<ProfileResponse>(["getMyProfile"], res);
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | updateMyProfile ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onSubmit = () => {
    const updateData: ProfileUpdateRequest = {
      data: {
        about: about?.trim() ?? "",
        isBirthdayPublic,
        isClubPublic,
        isContactPublic,
        isEmailPublic,
        isFeedPublic,
      },
    };

    let splitedThumbnail = thumbnail?.split("/");
    let splitedBackgroundImage = backgroundImage?.split("/");

    let basicImagePath = Image.resolveAssetSource(require("../../assets/basic.jpg")).uri;

    if (thumbnail && splitedThumbnail) {
      updateData.thumbnail = {
        uri: Platform.OS === "android" ? thumbnail : thumbnail.replace("file://", ""),
        type: "image/jpeg",
        name: splitedThumbnail[splitedThumbnail.length - 1],
      };
    }

    if (backgroundImage && splitedBackgroundImage) {
      updateData.backgroundImage = {
        uri: Platform.OS === "android" ? backgroundImage : backgroundImage.replace("file://", ""),
        type: "image/jpeg",
        name: splitedBackgroundImage[splitedBackgroundImage.length - 1],
      };
    }

    console.log(updateData);

    profileMutation.mutate(updateData);
  };

  const AnimatedNavigationView = Animated.createAnimatedComponent(NavigationView);

  return (
    <>
      <AnimatedNavigationView height={headerHeight + top} style={{ paddingTop: top, backgroundColor: bgColor }}>
        <LeftNavigationView>
          <TouchableOpacity onPress={goBack}>
            <Animated.View style={{ position: "absolute" }}>
              <Entypo name="chevron-thin-left" size={20} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </LeftNavigationView>
        <CenterNavigationView>
          <Animated.View style={{ opacity: fadeIn }}>
            <NavigationTitle>{"프로필 수정"}</NavigationTitle>
          </Animated.View>
        </CenterNavigationView>
        <RightNavigationView>
          <Entypo name="chevron-thin-left" size={20} color="transparent" />
        </RightNavigationView>
      </AnimatedNavigationView>

      <Animated.ScrollView bounces={false} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}>
        <Header>
          <FastImage style={{ width: "100%", height: "100%" }} source={{ uri: backgroundImage ?? profile?.backgroundImage ?? Image.resolveAssetSource(require("../../assets/basic.jpg")).uri }}>
            <FilterView>
              <BackgroundChangeButton activeOpacity={1} onPress={() => pickImage(IMAGE_TYPE.BACKGROUND)}>
                <CircleIcon uri={thumbnail ?? profile?.thumbnail} size={140} onPress={() => pickImage(IMAGE_TYPE.THUMBNAIL)} />
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
                  onValueChange={() => setIsEmailPublic((prev) => (prev === "Y" ? "N" : "Y"))}
                  value={isEmailPublic === "Y"}
                  style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.7 }, { scaleY: 0.7 }] : [], marginRight: -5 }}
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
                  onValueChange={() => setIsContactPublic((prev) => (prev === "Y" ? "N" : "Y"))}
                  value={isContactPublic === "Y"}
                  style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.7 }, { scaleY: 0.7 }] : [], marginRight: -5 }}
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
                  onValueChange={() => setIsBirthdayPublic((prev) => (prev === "Y" ? "N" : "Y"))}
                  value={isBirthdayPublic === "Y"}
                  style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.7 }, { scaleY: 0.7 }] : [], marginRight: -5 }}
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
              <PersonalItem style={{ borderBottomWidth: 0 }}>
                <PersonalInfo>
                  <PersonalInfoTitle style={{ width: 100 }}>{`나의 모임 정보`}</PersonalInfoTitle>
                </PersonalInfo>
                <Switch
                  trackColor={{ false: "#D4D4D4", true: lightTheme.accentColor }}
                  thumbColor={"white"}
                  onValueChange={() => setIsClubPublic((prev) => (prev === "Y" ? "N" : "Y"))}
                  value={isClubPublic === "Y"}
                  style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.7 }, { scaleY: 0.7 }] : [], marginRight: -5 }}
                />
              </PersonalItem>
              {profile?.clubs?.map((club: Club, index: number) => (
                <ClubItem key={`Club_${club.id}`} style={index === profile?.clubs?.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <ClubThumbnail source={club.thumbnail ? { uri: club.thumbnail } : require("../../assets/basic.jpg")} />
                  <ClubInfo>
                    <ClubInfoDetail>
                      <ClubInfoDetailHeader>
                        <ClubNameText>{club.name}</ClubNameText>
                        <Iconify icon="ant-design:user-outlined" size={14} color="#c4c4c4" />
                        <ClubMemberCount>{club.recruitNumber}</ClubMemberCount>
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
                  onValueChange={() => setIsFeedPublic((prev) => (prev === "Y" ? "N" : "Y"))}
                  value={isFeedPublic === "Y"}
                  style={{ transform: Platform.OS === "ios" ? [{ scaleX: 0.7 }, { scaleY: 0.7 }] : [], marginRight: -5 }}
                />
              </PersonalItem>
              <SectionContentSubText>{`비공개 설정 시 마이페이지 게시물 탭에서 본인에게만 피드가 보여집니다.`}</SectionContentSubText>
            </SectionContent>
          </Section>
        </Content>
        <BottomButton onPress={onSubmit} title={"저장"} backgroundColor={lightTheme.accentColor} disabled={profileMutation.isLoading} />
      </Animated.ScrollView>
    </>
  );
};

export default ProfileEdit;
