import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "E":
        return weekName[d.getDay()];
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
    }
  });
};

String.prototype.string = function (len) {
  var s = "",
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

const Container = styled.View`
  flex: 1;
  padding-left: 15px;
  padding-right: 15px;
`;

const ImagePickerView = styled.View`
  width: 100%;
  height: 130px;
  align-items: center;
`;

const ImagePickerWrap = styled.View`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgb(255, 255, 255);
  background-color: white;
  box-shadow: 1px 1px 1px gray;
  margin-top: 15px;
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

const ProfileText = styled.Text`
  margin-top: 10px;
  font-size: 12px;
  font-weight: normal;
  color: #2995fa;
`;

const Form = styled.View`
  margin-bottom: 15px;
`;

const Title = styled.Text`
  color: #b0b0b0;
  font-size: 10px;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 5px;
`;

const TextBtn = styled.TouchableOpacity``;

const FieldContentView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 5px;
  flex-direction: row;
`;
const FieldContentLine = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FieldContentText = styled.Text`
  font-size: 14px;
  margin-right: 10px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const EditProfile = () => {
  const [imageURI, setImageURI] = useState<string | null>(null);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 4) * 3);

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

  const [checked, setChecked] = React.useState("first");

  const placeholder = "날짜를 입력해주세요";

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [text, onChangeText] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("dateFormat: ", date.format("yyyy/MM/dd"));
    hideDatePicker();
    onChangeText(date.format("yyyy/MM/dd"));
  };

  const [approvalMethod, setApprovalMethod] = useState<number>(0);

  const { colors } = useTheme();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <ImagePickerView>
          <ImagePickerWrap>
            <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={0.8}>
              <PickedImage height={imageHeight} source={{ uri: imageURI }} />
            </ImagePickerButton>
          </ImagePickerWrap>
          <ProfileText onPress={pickImage}>프로필 사진 설정</ProfileText>
        </ImagePickerView>
        <Form>
          <Title>이름</Title>
          <Input autoCorrect={false} />
        </Form>
        <Form>
          <Title>성별</Title>
          <FieldContentView>
            <FieldContentLine>
              <Button onPress={() => setApprovalMethod(0)} activeOpacity={0.5}>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-blank" size={20} color="#E8E8E8" /> : <MaterialCommunityIcons name="radiobox-marked" size={20} color="#ff714b" />}
                <FieldContentText> 남자</FieldContentText>
              </Button>
            </FieldContentLine>
            <FieldContentLine>
              <Button onPress={() => setApprovalMethod(1)} activeOpacity={0.5}>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#ff714b" /> : <MaterialCommunityIcons name="radiobox-blank" size={20} color="#E8E8E8" />}
                <FieldContentText> 여자</FieldContentText>
              </Button>
            </FieldContentLine>
          </FieldContentView>
        </Form>
        <Form>
          <Title>생년월일</Title>
          <TextBtn onPress={showDatePicker}>
            <Input pointerEvents="none" placeholder={placeholder} placeholderTextColor="#000000" underlineColorAndroid="transparent" editable={false} value={text} />
            {/* <DateTimePickerModal headerTextIOS={placeholder} isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} /> */}
          </TextBtn>
        </Form>
        <Form>
          <Title>연락처</Title>
          <Input autoCorrect={false} />
        </Form>
        <Form>
          <Title>교회</Title>
          <Input autoCorrect={false} />
        </Form>
        <Form>
          <Title>관심사(3개 이상 택)</Title>
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;
