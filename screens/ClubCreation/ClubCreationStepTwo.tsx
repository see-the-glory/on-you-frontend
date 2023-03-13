import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import { ClubCreationStepTwoScreenProps } from "../../Types/Club";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import CustomTextInput from "../../components/CustomTextInput";
import { useMutation } from "react-query";
import { ClubApi, DuplicateCheckResponse, DuplicateClubNameCheckRequest, ErrorResponse } from "../../api";
import BottomButton from "../../components/BottomButton";

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  color: #5c5c5c;
`;
const Content = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 100%;
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
  margin-bottom: 10px;
`;

const ImagePickerText = styled(CustomText)`
  font-size: 15px;
  color: #2995fa;
  line-height: 22px;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: ${(props: any) => props.height}px;
`;

const ContentItem = styled.View<{ error: boolean }>`
  width: 100%;
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? "#FF6534" : "#cecece")};
  margin: 10px 0px;
`;

const ValidationView = styled.View`
  margin-top: 3px;
  height: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const ValidationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const ValidationText = styled(CustomText)`
  color: #ff6534;
  font-size: 10px;
  line-height: 15px;
`;

const ItemSubView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ErrorView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ErrorText = styled(CustomText)`
  color: #ff6534;
`;

const Item = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled(CustomText)`
  font-size: 13px;
  line-height: 19px;
  color: #b0b0b0;
  margin-bottom: 5px;
`;

const ItemText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  margin-right: 5px;
`;

const ItemTextInput = styled(CustomTextInput)`
  font-size: 15px;
  line-height: 22px;
  padding: 0px 5px;
  flex: 1;
`;

const RadioButtonView = styled.View`
  flex-direction: row;
  padding: 2px 5px;
  align-items: center;
`;

const RadioButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

const CheckButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const CheckBox = styled.View<{ check: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const ClubCreationStepTwo: React.FC<ClubCreationStepTwoScreenProps> = ({
  route: {
    params: { category1, category2 },
  },
  navigation: { navigate },
}) => {
  const toast = useToast();
  const [clubName, setClubName] = useState<string>("");
  const [nameErrorCheck, setNameErrorCheck] = useState<boolean>(false);
  const [isDuplicatedName, setIsDuplicatedName] = useState<boolean>(false);
  const [maxNumber, setMaxNumber] = useState<string>("");
  const [maxNumberInfinity, setMaxNumberInfinity] = useState<boolean>(false);
  const [isApproveRequired, setIsApproveRequired] = useState("Y");
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 5) * 3);
  const specialChar = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/;
  const lengthLimit = 8;

  const clubNameMutation = useMutation<DuplicateCheckResponse, ErrorResponse, DuplicateClubNameCheckRequest>(ClubApi.duplicateClubNameCheck);

  const pickImage = async () => {
    let image = await ImagePicker.openPicker({
      mediaType: "photo",
    });

    let croped = await ImagePicker.openCropper({
      mediaType: "photo",
      path: image.path,
      width: 1080,
      height: 1080,
      cropperCancelText: "Cancel",
      cropperChooseText: "Check",
      cropperToolbarTitle: "이미지를 크롭하세요",
      forceJpg: true,
    });

    if (croped) setImageURI(croped.path);
  };

  const goToNext = () => {
    /** Validation */
    if (clubName.trim() === "") {
      return toast.show(`모임 이름은 공백으로 설정할 수 없습니다.`, { type: "warning" });
    } else if (specialChar.test(clubName)) {
      return toast.show(`모임 이름에 특수문자가 포함되어 있습니다.`, { type: "warning" });
    } else if (clubName.length > lengthLimit) {
      return toast.show(`모임 이름은 ${lengthLimit}자 이하여야 합니다.`, { type: "warning" });
    }

    const reqeustData: DuplicateClubNameCheckRequest = {
      clubName: clubName.trim(),
    };
    clubNameMutation.mutate(reqeustData, {
      onSuccess: (res) => {
        if (res?.data?.isDuplicated === "Y") {
          toast.show(`모임 이름이 이미 존재합니다.`, { type: "warning" });
          setIsDuplicatedName(true);
        } else {
          navigate("ClubCreationStepThree", {
            category1,
            category2,
            clubName,
            maxNumber: maxNumber === "무제한 정원" ? 0 : Number(maxNumber.split(" ")[0]),
            isApproveRequired,
            phoneNumber,
            organizationName,
            imageURI,
          });
        }
      },
      onError: (error) => {
        console.log(`API ERROR | duplicateClubNameCheck ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });
  };

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 11) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          <HeaderView>
            <H1>모임 이름 / 정원</H1>
            <H2>모임 이름과 정원을 설정하세요.</H2>
          </HeaderView>

          <Content>
            <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={0.8}>
              {imageURI ? <PickedImage height={imageHeight} source={{ uri: imageURI }} /> : <ImagePickerText>대표 사진 설정</ImagePickerText>}
            </ImagePickerButton>
            <ContentItem error={nameErrorCheck || isDuplicatedName} style={{ marginBottom: 0 }}>
              <ItemTitle>모임 이름</ItemTitle>
              <ItemSubView>
                <ItemTextInput
                  value={clubName}
                  placeholder={`모임명 ${lengthLimit}자 이내 (특문 불가)`}
                  placeholderTextColor="#B0B0B0"
                  maxLength={10}
                  onEndEditing={() => {
                    setClubName((prev) => prev.trim());
                  }}
                  onChangeText={(name: string) => {
                    setClubName(name);
                    if (isDuplicatedName) setIsDuplicatedName(false);
                    if (!nameErrorCheck && (name.length > lengthLimit || specialChar.test(name))) setNameErrorCheck(true);
                    if (nameErrorCheck && name.length <= lengthLimit && !specialChar.test(name)) setNameErrorCheck(false);
                  }}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  includeFontPadding={false}
                />
                {isDuplicatedName ? (
                  <ErrorView>
                    <AntDesign name="exclamationcircleo" size={12} color="#ff6534" />
                    <ErrorText>{` 이미 사용 중인 이름입니다.`}</ErrorText>
                  </ErrorView>
                ) : (
                  <></>
                )}
              </ItemSubView>
            </ContentItem>
            <ValidationView>
              {specialChar.test(clubName) ? (
                <ValidationItem>
                  <AntDesign name="check" size={12} color={"#ff6534"} />
                  <ValidationText>{` 특수문자 불가능`}</ValidationText>
                </ValidationItem>
              ) : (
                <></>
              )}
              {clubName.length > lengthLimit ? (
                <ValidationItem>
                  <AntDesign name="check" size={12} color={"#ff6534"} />
                  <ValidationText>{` ${lengthLimit}자 초과`}</ValidationText>
                </ValidationItem>
              ) : (
                <></>
              )}
            </ValidationView>

            <ContentItem style={{ marginTop: 2 }}>
              <ItemTitle>모집 정원</ItemTitle>
              <Item>
                <ItemTextInput
                  keyboardType="number-pad"
                  placeholder="최대 수용가능 정원 수"
                  placeholderTextColor="#B0B0B0"
                  onPressIn={() => {
                    if (maxNumberInfinity === false) setMaxNumber((prev) => prev.split(" ")[0]);
                  }}
                  onEndEditing={() =>
                    setMaxNumber((prev) => {
                      prev = prev.trim();
                      if (prev === "" || prev === "0") return "";
                      else return `${prev} 명`;
                    })
                  }
                  value={maxNumber}
                  maxLength={6}
                  onChangeText={(num: string) => {
                    if (num.length < 3) setMaxNumber(num);
                    else toast.show("최대 99명까지 가능합니다.", { type: "warning" });
                  }}
                  editable={!maxNumberInfinity}
                  includeFontPadding={false}
                />
                <CheckButton
                  onPress={() => {
                    if (!maxNumberInfinity) setMaxNumber("무제한 정원");
                    else setMaxNumber("");
                    setMaxNumberInfinity((prev) => !prev);
                  }}
                >
                  <ItemText>인원 수 무제한으로 받기</ItemText>
                  <CheckBox check={maxNumberInfinity}>
                    <Ionicons name="checkmark-sharp" size={13} color={maxNumberInfinity ? "#FF6534" : "#e8e8e8"} />
                  </CheckBox>
                </CheckButton>
              </Item>
            </ContentItem>
            <ContentItem>
              <ItemTitle>가입 승인 방법</ItemTitle>
              <RadioButtonView>
                <RadioButton onPress={() => setIsApproveRequired((prev) => (prev === "Y" ? "Y" : "Y"))}>
                  <Ionicons
                    name={isApproveRequired === "Y" ? "radio-button-on" : "radio-button-off"}
                    size={16}
                    color={isApproveRequired === "Y" ? "#FF6534" : "rgba(0, 0, 0, 0.3)"}
                    style={{ marginRight: 3 }}
                  />
                  <ItemText>관리자 승인 후 가입</ItemText>
                </RadioButton>
                <RadioButton onPress={() => setIsApproveRequired((prev) => (prev === "Y" ? "N" : "N"))}>
                  <Ionicons
                    name={isApproveRequired === "N" ? "radio-button-on" : "radio-button-off"}
                    size={16}
                    color={isApproveRequired === "N" ? "#FF6534" : "rgba(0, 0, 0, 0.3)"}
                    style={{ marginRight: 3 }}
                  />
                  <ItemText>누구나 바로 가입</ItemText>
                </RadioButton>
              </RadioButtonView>
            </ContentItem>
            <ContentItem>
              <ItemTitle>모임 담당자 연락처</ItemTitle>
              <ItemTextInput keyboardType="numeric" placeholder="010-0000-0000" maxLength={13} onChangeText={(phone) => setPhoneNumber(phone)} value={phoneNumber} includeFontPadding={false} />
            </ContentItem>
            <ContentItem>
              <ItemTitle>모임 소속 교회</ItemTitle>
              <ItemTextInput
                value={organizationName}
                placeholder="모임이 소속된 교회 또는 담당자가 섬기는 교회명"
                placeholderTextColor="#B0B0B0"
                maxLength={16}
                onChangeText={(name: string) => setOrganizationName(name)}
                onEndEditing={() => setOrganizationName((prev) => prev.trim())}
                returnKeyType="done"
                returnKeyLabel="done"
                includeFontPadding={false}
              />
            </ContentItem>
          </Content>
        </View>
      </ScrollView>

      <BottomButton
        onPress={goToNext}
        disabled={nameErrorCheck || clubName === "" || maxNumber === "" || phoneNumber === "" || organizationName === "" || !imageURI}
        backgroundColor={"#FF6534"}
        title={"다음 2/3"}
        contentContainerStyle={Platform.OS === "android" ? { position: "relative" } : {}}
      />
    </KeyboardAvoidingView>
  );
};

export default ClubCreationStepTwo;
