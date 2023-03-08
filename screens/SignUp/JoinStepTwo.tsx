import { AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const ButtonWrap = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 10%;
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
  font-size: 13px;
  margin-top: 7px;
`;

const Input = styled.TextInput<{ error: boolean }>`
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

const JoinStepTwo: React.FC<NativeStackScreenProps<any, "JoinStepTwo">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<boolean>(false);

  const nameReg = /^[가-힣]+$/;

  const goToNext = () => {
    if (!nameReg.test(userName)) {
      return;
    }
    navigate("SignUpStack", {
      screen: "JoinStepThree",
      name: userName,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <AskText>성함이 어떻게 되시나요?</AskText>
          <SubText>정확한 성함을 입력해 주세요.</SubText>
          <Input
            keyboardType={"name-phone-pad"}
            placeholder="홍길동"
            maxLength={10}
            autoCorrect={false}
            onChangeText={(name: string) => setUserName(name)}
            placeholderTextColor={"#B0B0B0"}
            error={userName !== "" && !nameReg.test(userName)}
          />
          {userName !== "" && !nameReg.test(userName) ? (
            <ValidationView>
              <AntDesign name="exclamationcircleo" size={12} color="#ff6534" />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
        </Wrap>
        <ButtonWrap>
          <Button onPress={goToNext} disabled={!nameReg.test(userName)}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepTwo;
