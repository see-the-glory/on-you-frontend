import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { ClubEditBasicsProps } from "../../Types/Club";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { Category, CategoryResponse, ClubApi } from "../../api";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MainView = styled.ScrollView``;
const Header = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
`;

const ImagePickerText = styled(CustomText)`
  font-size: 14px;
  font-weight: 500;
  color: #2995fa;
  line-height: 22px;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const Content = styled.View`
  padding: 20px;
  margin-bottom: 50px;
`;
const ContentItem = styled.View`
  width: 100%;
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 3px;
  margin-bottom: 30px;
`;

const Item = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled(CustomText)`
  font-size: 10px;
  line-height: 16px;
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

const CategoryText = styled(CustomText)<{ selected?: boolean }>`
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: ${(props) => (props.selected ? "white" : "black")};
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px 0px;
`;
const CategoryLabel = styled.TouchableOpacity<{ selected?: boolean }>`
  justify-content: center;
  align-items: center;
  padding: 3px 5px;
  border-radius: 20px;
  border: 1px solid #d7d7d7;
  background-color: ${(props) => (props.selected ? "#295AF5" : "white")};
  margin: 0px 5px;
`;

const ClubEditBasics: React.FC<ClubEditBasicsProps> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubData },
  },
}) => {
  const [clubName, setClubName] = useState(clubData.name);
  const [maxNumber, setMaxNumber] = useState(`${String(clubData.maxNumber)} 명`);
  const [maxNumberInfinity, setMaxNumberInfinity] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(clubData.contactPhone ?? "");
  const [organizationName, setOrganizationName] = useState(clubData.organizationName ?? "");
  const [isApproveRequired, setIsApproveRequired] = useState("Y");
  const [selectCategory1, setCategory1] = useState(clubData.categories[0]?.id ?? -1);
  const [selectCategory2, setCategory2] = useState(clubData.categories[1]?.id ?? -1);
  const [categoryBundle, setCategoryBundle] = useState<Array<Category[]>>();
  const [imageURI, setImageURI] = useState<string | null>(null);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const toast = useToast();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 4) * 3);

  const { isLoading: categoryLoading, data: categories } = useQuery<CategoryResponse>(["getCategories"], ClubApi.getCategories, {
    onSuccess: (res) => {
      const count = 4;
      const bundle = [];
      for (let i = 0; i < res.data.length; i += count) bundle.push(res.data.slice(i, i + count));
      setCategoryBundle(bundle);
    },
  });
  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  const save = () => {};

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (result.cancelled === false) {
      setImageURI(result.uri);
    }
  };

  const onPressCategory = (id: number) => {
    if (selectCategory1 === id) {
      return setCategory1(-1);
    } else if (selectCategory2 === id) {
      return setCategory2(-1);
    }
    if (selectCategory1 === -1) {
      return setCategory1(id);
    } else if (selectCategory2 === -1) {
      return setCategory2(id);
    } else {
      toast.show("카테고리는 2개만 고를 수 있습니다.", {
        type: "warning",
      });
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Header>
            <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={0.8}>
              {imageURI ? <PickedImage height={imageHeight} source={{ uri: imageURI }} /> : <ImagePickerText>대표 사진 바꾸기</ImagePickerText>}
            </ImagePickerButton>
          </Header>
          <Content>
            <ContentItem>
              <ItemTitle>모임 이름</ItemTitle>
              <ItemTextInput value={clubName} placeholder="모임명 16자 이내 (특수문자 불가)" maxLength={16} onChangeText={(name) => setClubName(name)} returnKeyType="done" returnKeyLabel="done" />
            </ContentItem>
            <ContentItem>
              <ItemTitle>모집 정원</ItemTitle>
              <Item>
                <ItemTextInput
                  keyboardType="number-pad"
                  placeholder="최대 수용가능 정원 수"
                  onPressIn={() => setMaxNumber((prev) => prev.split(" ")[0])}
                  onEndEditing={() => setMaxNumber((prev) => (prev === "" ? "0 명" : `${prev} 명`))}
                  value={maxNumber}
                  maxLength={6}
                  onChangeText={(num) => {
                    if (num.length < 3) setMaxNumber(num);
                    else
                      toast.show("최대 99명까지 가능합니다.", {
                        type: "warning",
                      });
                  }}
                  editable={!maxNumberInfinity}
                />
                <CheckButton
                  onPress={() => {
                    if (maxNumberInfinity) {
                      setMaxNumberInfinity(false);
                      setMaxNumber(`${String(clubData.maxNumber)} 명`);
                    } else {
                      setMaxNumberInfinity(true);
                      setMaxNumber("무제한 정원");
                    }
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
              <ItemTextInput keyboardType="numeric" placeholder="010-0000-0000" maxLength={13} onChangeText={(phone) => setPhoneNumber(phone)} value={phoneNumber} />
            </ContentItem>
            <ContentItem>
              <ItemTitle>모임 소속 교회</ItemTitle>
              <ItemTextInput
                value={organizationName}
                placeholder="모임이 소속된 교회 또는 담당자가 섬기는 교회명"
                maxLength={16}
                onChangeText={(name) => setOrganizationName(name)}
                returnKeyType="done"
                returnKeyLabel="done"
              />
            </ContentItem>
            {categoryLoading ? (
              <></>
            ) : (
              <ContentItem style={{ borderBottomWidth: 0 }}>
                <ItemTitle>모임 카테고리</ItemTitle>
                {categoryBundle?.map((bundle, index) => (
                  <CategoryView key={index}>
                    {bundle?.map((category, index) => (
                      <CategoryLabel key={index} onPress={() => onPressCategory(category.id)} selected={selectCategory1 === category.id || selectCategory2 === category.id}>
                        <CategoryText selected={selectCategory1 === category.id || selectCategory2 === category.id}>{`${category.thumbnail} ${category.name}`}</CategoryText>
                      </CategoryLabel>
                    ))}
                  </CategoryView>
                ))}
              </ContentItem>
            )}
          </Content>
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubEditBasics;
