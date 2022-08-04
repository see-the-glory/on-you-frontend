import React, { useEffect, useState } from "react";
import { Text, Alert, Platform, Pressable, View, ScrollView, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectDropdown from "react-native-select-dropdown";
import RNPickerSelect from "react-native-picker-select";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
//img
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ImageArea = styled.View`
  width: 150px;
  height: 150px;
  background: gray;
`;

const ImageSelector = styled.View`
  flex-direction: row;
`;

const Circle = styled.Image`
  background-color: #cdcdcd;
  width: 100px;
  height: 100px;
`;

const TextInPut = styled.TextInput`
  color: black;
`;
const PublicArea = styled.View`
  flex-direction: row;
`;
const CtgrArea = styled.View`
  flex-direction: row;
`;
const ButtonArea = styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;
const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #295af5;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

export default function CreateHomePeed({ navigation: { navigate } }) {
  const [displayName, setDisplayName] = useState("");
  const [response, setResponse] = useState(null);
  const Stack = createNativeStackNavigator();
  const [selectCategory, setCategory] = useState(null);

  const [image, setImage] = useState(null);

  const category = ["독서", "자기개발", "음식", "봉사", "운동", "문화생활", "게임", "창작", "여행", "경건생활", "반려동물", "기타"];

  return (
    <Container>
      <ImageSelector>
        <View style={{ backgroundColor: "gray", height: 120, width: 120 }}></View>
        <ScrollView>
          <TextInPut multiline numberOfLines={5} placeholder="문구 입력..." keyboardType="email-address" />
        </ScrollView>
      </ImageSelector>
      <PublicArea>
        <Text>공개여부</Text>
        <RNPickerSelect
          onValueChange={(value) => value}
          items={[
            { label: "공개", value: "public" },
            { label: "비공개", value: "Nondisclosure" },
            { label: "알아서해줘", value: "whatever" },
          ]}
          style={{}}
        />
      </PublicArea>
      <CtgrArea>
        <Text>카테고리</Text>
        <SelectDropdown
          data={category}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
      </CtgrArea>

      {/*<RNPickerSelect
                onValueChange={(value) => (value)}
                items={[
                    { label: '보드게이', value: 'BoardGame' },
                    { label: '성경읽기', value: 'ReadBible' },
                    { label: '영화보기', value: 'SeeMovie' },
                ]}
            />*/}
      <ButtonArea>
        <NextButton
          onPress={() => {
            if (selectCategory === null) {
              return Alert.alert("카테고리를 선택하세요!");
            } else {
              return navigate("StepTwo", { category: selectCategory });
            }
          }}
        >
          <ButtonText>공유</ButtonText>
        </NextButton>
      </ButtonArea>
    </Container>
  );
}
