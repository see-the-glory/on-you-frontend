import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ClubCreationStepTwoScreenProps } from "../../Types/Club";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.ScrollView`
  flex: 1;
  padding: 0px 20px;
`;

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
  margin: 20px 0px 10px 0px;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  margin: 10px 0px;
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  color: #5c5c5c;
  margin-bottom: 15px;
`;

const Content = styled.View`
  width: 100%;
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
  margin: 15px 0px;
`;

const ImagePickerText = styled(CustomText)`
  font-size: 14px;
  color: #2995fa;
  line-height: 22px;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const ContentItem = styled.View`
  width: 100%;
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 3px;
  margin: 15px 0px;
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
  font-size: 12px;
  line-height: 16px;
  margin-right: 5px;
`;

const ItemTextInput = styled(CustomTextInput)`
  font-size: 14px;
  line-height: 20px;
  padding: 0px 5px;
  flex: 1;
`;

const RadioButtonView = styled.View`
  flex-direction: row;
  padding: 5px;
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
  background-color: ${(props) => (props.check ? "white" : "#E8E8E8")};
`;

const FooterView = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 30px 0px 80px 0px;
`;
const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#FF714B")};
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  color: white;
`;

const ClubCreationStepTwo: React.FC<ClubCreationStepTwoScreenProps> = ({
  route: {
    params: { category1, category2 },
  },
  navigation: { navigate },
}) => {
  const toast = useToast();
  const [clubName, setClubName] = useState<string>("");
  const [maxNumber, setMaxNumber] = useState<string>("");
  const [maxNumberInfinity, setMaxNumberInfinity] = useState<boolean>(false);
  const [isApproveRequired, setIsApproveRequired] = useState("Y");
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 4) * 3);
  let specialChar = /[`~!@#$%^&*|\\\'\";:\/?]/gi;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (result.canceled === false) {
      setImageURI(result.assets[0].uri);
    }
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
      <Container
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HeaderView>
          <H1>모임 이름 / 정원</H1>
          <H2>모임 이름과 정원을 설정하세요.</H2>
        </HeaderView>

        <Content>
          <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={0.8}>
            {imageURI ? <PickedImage height={imageHeight} source={{ uri: imageURI }} /> : <ImagePickerText>대표 사진 설정</ImagePickerText>}
          </ImagePickerButton>
          <ContentItem>
            <ItemTitle>모임 이름</ItemTitle>
            <ItemTextInput
              value={clubName}
              placeholder="모임명 8자 이내 (특수문자 불가)"
              placeholderTextColor="#B0B0B0"
              maxLength={8}
              onEndEditing={() => {
                if (clubName.trim() === "") {
                  toast.show("모임 이름을 공백으로 설정할 수 없습니다.", {
                    type: "warning",
                  });
                }
                if (specialChar.test(clubName)) {
                  toast.show("모임 이름에 특수문자가 있습니다.", {
                    type: "warning",
                  });
                }
                setClubName((prev) => prev.trim());
              }}
              onChangeText={(name: string) => setClubName(name)}
              returnKeyType="done"
              returnKeyLabel="done"
              includeFontPadding={false}
            />
          </ContentItem>
          <ContentItem>
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
                  else
                    toast.show("최대 99명까지 가능합니다.", {
                      type: "warning",
                    });
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
                  <Ionicons name="checkmark-sharp" size={16} color={maxNumberInfinity ? "#FF714B" : "#e8e8e8"} />
                </CheckBox>
              </CheckButton>
            </Item>
          </ContentItem>
          <ContentItem>
            <ItemTitle>가입 승인 방법</ItemTitle>
            <RadioButtonView>
              <RadioButton onPress={() => setIsApproveRequired((prev) => (prev === "Y" ? "Y" : "Y"))}>
                <Ionicons name={isApproveRequired === "Y" ? "radio-button-on" : "radio-button-off"} size={16} color={isApproveRequired === "Y" ? "#FF714B" : "black"} style={{ marginRight: 3 }} />
                <ItemText>관리자 승인 후 가입</ItemText>
              </RadioButton>
              <RadioButton onPress={() => setIsApproveRequired((prev) => (prev === "Y" ? "N" : "N"))}>
                <Ionicons name={isApproveRequired === "N" ? "radio-button-on" : "radio-button-off"} size={16} color={isApproveRequired === "N" ? "#FF714B" : "black"} style={{ marginRight: 3 }} />
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

        <FooterView>
          <NextButton
            onPress={() => {
              /** Validation */
              if (clubName === "") {
                return toast.show("모임 이름은 공백으로 설정할 수 없습니다.", {
                  type: "warning",
                });
              } else if (specialChar.test(clubName)) {
                return toast.show("모임 이름에 특수문자가 포함되어 있습니다.", {
                  type: "warning",
                });
              }
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
            }}
            disabled={clubName === "" || maxNumber === "" || phoneNumber === "" || organizationName === ""}
          >
            <ButtonText>다음 2/3</ButtonText>
          </NextButton>
        </FooterView>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default ClubCreationStepTwo;
