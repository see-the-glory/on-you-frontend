import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import styled from "styled-components/native";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

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
  width: 70px;
  height: 70px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  background-color: #000;
  margin-top: 30px;
`;

const Logo = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 15px;
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
        <Input autoCorrect={false} />
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
