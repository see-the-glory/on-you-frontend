import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 30%;
  height: 2px;
  background-color: #295af5;
`;

const AskText = styled.Text`
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
`;

const SubText = styled.Text`
  color: #a0a0a0;
  font-size: 12px;
  margin-top: 7px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 47px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const Error = styled.Text`
  color: #ff6534;
  font-size: 12px;
`;

const ValidationView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
  margin-bottom: 20px;
`;
const ValidationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const ValidationText = styled.Text`
  color: #8e8e8e;
  font-size: 12px;
`;

const JoinStepFour: React.FC<NativeStackScreenProps<any, "JoinStepFour">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name, email },
  },
}) => {
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  // const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  const numReg = /[0-9]+/;
  const engReg = /[a-zA-Z]+/;
  const specialReg = /[!@#$%^*+=-]+/;

  const validate = () => {
    if (!numReg.test(password) || !engReg.test(password) || !specialReg.test(password) || password.length < 8 || password !== checkPassword) {
      return;
    }
    navigate("SignUpStack", {
      screen: "JoinStepFive",
      name,
      email,
      password,
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "JoinStepThree", name, email })}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Wrap>
          <BorderWrap>
            <Border></Border>
          </BorderWrap>
          <AskText>비밀번호를 설정해주세요.</AskText>
          <SubText>로그인 정보로 활용됩니다.</SubText>
          <Input placeholder="영문, 숫자, 특수문자 포함 8자 이상" placeholderTextColor={"#B0B0B0"} secureTextEntry={true} autoCorrect={false} onChangeText={(value: string) => setPassword(value)} />

          <ValidationView>
            <ValidationItem>
              <AntDesign name="check" size={12} color={engReg.test(password) ? "#295AF5" : "#ff6534"} />
              <ValidationText>{` 영문 포함`}</ValidationText>
            </ValidationItem>
            <ValidationItem>
              <AntDesign name="check" size={12} color={numReg.test(password) ? "#295AF5" : "#ff6534"} />
              <ValidationText>{` 숫자 포함`}</ValidationText>
            </ValidationItem>
            <ValidationItem>
              <AntDesign name="check" size={12} color={specialReg.test(password) ? "#295AF5" : "#ff6534"} />
              <ValidationText>{` 특수문자 포함`}</ValidationText>
            </ValidationItem>
            <ValidationItem>
              <AntDesign name="check" size={12} color={password.length > 7 ? "#295AF5" : "#ff6534"} />
              <ValidationText>{` 8자리 이상`}</ValidationText>
            </ValidationItem>
          </ValidationView>
          <AskText>비밀번호를 다시 입력해주세요.</AskText>
          <Input
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor={"#B0B0B0"}
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={(value: string) => setCheckPassword(value)}
            clearButtonMode="always"
          />
          {password !== checkPassword && password !== "" && checkPassword !== "" ? (
            <ValidationView>
              <AntDesign name="exclamationcircleo" size={12} color="#ff6534" />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
        </Wrap>
        <ButtonWrap>
          <Button onPress={validate} disabled={!numReg.test(password) || !engReg.test(password) || !specialReg.test(password) || password.length < 8 || password !== checkPassword}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepFour;
