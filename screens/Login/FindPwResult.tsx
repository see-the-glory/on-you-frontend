import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 30px;
`;

const TextWrap = styled.View`
  width: 100%;
  margin-top: 40%;
  justify-content: center;
  align-items: center;
`;
const NoticeText = styled(CustomText)`
  color: black;
  font-family: "NotoSansKR-Bold";
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 25px;
`;
const NoticeSubText = styled(CustomText)`
  color: #8e8e8e;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 11px;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const LoginButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : "#ff6534")};
`;

const LoginTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: white;
  font-size: 20px;
  line-height: 24px;
`;

const FindPwResult: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const goToLogin = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TextWrap>
        <Feather name="check" size={52} color="#CCCCCC" />
        <NoticeText>{`해당 ID의 이메일 주소로\n임시 비밀번호를 발급했습니다.`}</NoticeText>
        <NoticeSubText>{`로그인 후 마이페이지에서\n비밀번호를 변경해주세요.`}</NoticeSubText>
      </TextWrap>

      <ButtonWrap>
        <LoginButton onPress={goToLogin}>
          <LoginTitle>확인</LoginTitle>
        </LoginButton>
      </ButtonWrap>
    </Container>
  );
};

export default FindPwResult;
