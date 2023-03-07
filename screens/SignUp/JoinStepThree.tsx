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
  width: 20%;
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
  border-bottom-color: ${(props: any) => (props.error ? "#ff6534" : "#b3b3b3")};
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
  background-color: ${(props: any) => (props.disabled ? "#d3d3d3" : "#295AF5")};
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
`;

const JoinStepThree: React.FC<NativeStackScreenProps<any, "JoinStepThree">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name },
  },
}) => {
  const [email, setEmail] = useState("");
  const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  const goToNext = () => {
    if (!emailReg.test(email)) {
      return;
    }
    navigate("SignUpStack", {
      screen: "JoinStepFour",
      name,
      email,
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "JoinStepTwo", name })}>
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
          <AskText>이메일을 적어주세요.</AskText>
          <SubText>로그인 ID로 활용됩니다.</SubText>
          <Input placeholder="example@gmail.com" placeholderTextColor={"#B0B0B0"} autoCorrect={false} onChangeText={(email: string) => setEmail(email)} error={email !== "" && !emailReg.test(email)} />
          {email !== "" && !emailReg.test(email) ? (
            <ValidationView>
              <AntDesign name="exclamationcircleo" size={12} color="#ff6534" />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
        </Wrap>
        <ButtonWrap>
          <Button onPress={goToNext} disabled={!emailReg.test(email)}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepThree;
