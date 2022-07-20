import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import styled from "styled-components/native";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";

  var weekName = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
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

const LogoWrap = styled.View`
  align-items: center;
`;

const LogoBtn = styled.TouchableOpacity``;

const LogoBox = styled.View`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgb(255, 255, 255);
  background-color: white;
  box-shadow: 1px 1px 1px gray;
  margin-top: 30px;
`;

const Logo = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const ProfileText = styled.Text`
  margin: 10px 0 20px 0;
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

const CheckWrap = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
`;

const CheckBox = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CheckText = styled.Text`
  margin-right: 10px;
`;

const EditProfile = () => {
  const [image, setImage] = useState(
    "https://api.adorable.io/avatars/80/abott@adorable.png"
  );

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

  const { colors } = useTheme();

  return (
    <Container>
      <LogoWrap>
        <LogoBtn>
          <LogoBox>
            <Logo
              source={{
                uri: image,
              }}
            ></Logo>
          </LogoBox>
        </LogoBtn>
        <ProfileText>프로필 사진 설정</ProfileText>
      </LogoWrap>

      <Form>
        <Title>이름</Title>
        <Input autoCorrect={false} />
      </Form>
      <Form>
        <Title>성별</Title>
        <CheckWrap>
          <CheckBox>
            <RadioButton
              value="first"
              status={checked === "first" ? "checked" : "unchecked"}
              color="#FF714B"
              onPress={() => setChecked("first")}
            />
            <CheckText>남자</CheckText>
          </CheckBox>
          <CheckBox>
            <RadioButton
              value="second"
              status={checked === "second" ? "checked" : "unchecked"}
              color="#FF714B"
              onPress={() => setChecked("second")}
            />
            <CheckText>여자</CheckText>
          </CheckBox>
        </CheckWrap>
      </Form>
      <Form>
        <Title>생년월일</Title>
        <TextBtn onPress={showDatePicker}>
          <Input
            pointerEvents="none"
            placeholder={placeholder}
            placeholderTextColor="#000000"
            underlineColorAndroid="transparent"
            editable={false}
            value={text}
          />
          <DateTimePickerModal
            headerTextIOS={placeholder}
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
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
  );
};

export default EditProfile;
