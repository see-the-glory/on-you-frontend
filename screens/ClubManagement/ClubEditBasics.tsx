import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { ClubEditBasicsProps } from "../../Types/Club";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { Category, CategoryResponse, ClubApi } from "../../api";
import { useToast } from "react-native-toast-notifications";

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
  background-color: #c4c4c4;
`;

const ImagePickerText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #2995fa;
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
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  margin-bottom: 30px;
`;

const Item = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: #b0b0b0;
  margin-bottom: 15px;
`;

const CheckButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const CheckBox = styled.View<{ check: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${(props) => (props.check ? "white" : "#E8E8E8")};
`;

const ItemText = styled.Text<{ selected?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.selected ? "white" : "black")};
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const CategoryLabel = styled.TouchableOpacity<{ selected?: boolean }>`
  width: 70px;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 20px;
  border: 1px solid #d7d7d7;
  background-color: ${(props) => (props.selected ? "#295AF5" : "white")};
`;

const ClubEditBasics: React.FC<ClubEditBasicsProps> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubData },
  },
}) => {
  const [clubName, setClubName] = useState("");
  const [maxNumber, setMaxNumber] = useState(String(clubData.maxNumber) + " 명");
  const [maxNumberInfinity, setMaxNumberInfinity] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
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
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <Text style={{ color: "#2995FA", fontSize: 18 }}>저장</Text>
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
              <TextInput
                defaultValue={clubData.name}
                placeholder="모임명 16자 이내 (특수문자 불가)"
                maxLength={16}
                onChangeText={(name) => setClubName(name)}
                returnKeyType="done"
                returnKeyLabel="done"
                style={{ fontSize: 16, padding: 3 }}
              />
            </ContentItem>
            <ContentItem>
              <ItemTitle>모집 정원</ItemTitle>
              <Item>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="최대 수용가능 정원 수"
                  onPressIn={() => setMaxNumber((prev) => prev.split(" ")[0])}
                  onEndEditing={() => setMaxNumber((prev) => (prev === "" ? "0 명" : `${prev} 명`))}
                  value={maxNumber}
                  maxLength={2}
                  onChangeText={(num) => setMaxNumber(num)}
                  style={{ fontSize: 16, padding: 3 }}
                  editable={!maxNumberInfinity}
                />
                <CheckButton
                  onPress={() => {
                    if (maxNumberInfinity) {
                      setMaxNumberInfinity(false);
                      setMaxNumber(String(clubData.maxNumber));
                    } else {
                      setMaxNumberInfinity(true);
                      setMaxNumber("무제한 정원");
                    }
                  }}
                >
                  <Text style={{ marginRight: 5 }}>인원 수 무제한으로 받기</Text>
                  <CheckBox check={maxNumberInfinity}>
                    <Ionicons name="checkmark-sharp" size={16} color={maxNumberInfinity ? "#FF714B" : "#e8e8e8"} />
                  </CheckBox>
                </CheckButton>
              </Item>
            </ContentItem>
            <ContentItem>
              <ItemTitle>가입 승인 방법</ItemTitle>
            </ContentItem>
            <ContentItem>
              <ItemTitle>모임 담당자 연락처</ItemTitle>
              <TextInput keyboardType="numeric" placeholder="010-0000-0000" maxLength={13} onChangeText={(phone) => setPhoneNumber(phone)} value={phoneNumber} style={{ fontSize: 16, padding: 3 }} />
            </ContentItem>
            <ContentItem>
              <ItemTitle>모임 소속 교회</ItemTitle>
              <TextInput
                defaultValue={clubData.organizationName}
                placeholder="모임이 소속된 교회 또는 담당자가 섬기는 교회명"
                maxLength={16}
                onChangeText={(name) => setOrganizationName(name)}
                returnKeyType="done"
                returnKeyLabel="done"
                style={{ fontSize: 16, padding: 3 }}
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
                        <ItemText selected={selectCategory1 === category.id || selectCategory2 === category.id}>{category.name}</ItemText>
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
