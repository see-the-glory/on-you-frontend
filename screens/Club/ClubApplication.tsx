import React from "react";
import { Alert, StatusBar } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const SCREEN_PADDING_SIZE = 20;

const Container = styled.SafeAreaView`
  flex: 1;
`;
const Header = styled.View`
  height: 80px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
`;
const HeaderBoldText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  font-family: "NotoSansKR-Bold";
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 250px;
  border: 1px solid #dcdcdc;
`;
const ContentText = styled(CustomText)`
  margin: 5px 5px;
  color: #343434;
`;

const Footer = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 0px;
  height: 70px;
`;
const RejectButton = styled.TouchableOpacity`
  width: 50%;
  background-color: #b0b0b0;
  justify-content: center;
  align-items: center;
`;
const AcceptButton = styled.TouchableOpacity`
  width: 50%;
  background-color: #295af5;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 20px;
  line-height: 26px;
  color: white;
`;

const reject = () => {
  Alert.alert("가입 거절", "정말로 가입을 거절하시겠습니까?", [
    { text: "아니요", onPress: () => {} },
    { text: "예", onPress: () => {} },
  ]);
};

const approve = () => {
  Alert.alert("가입 승인", "정말로 가입을 승인하시겠습니까?", [
    { text: "아니요", onPress: () => {} },
    { text: "예", onPress: () => {} },
  ]);
};

const ClubApplication = ({
  route: {
    params: { clubData, actionerName, applyMessage },
  },
  navigation: { navigate },
}) => {
  return (
    <Container>
      <StatusBar barStyle={"default"} />
      <Header style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <HeaderBoldText>{actionerName}</HeaderBoldText>
        <HeaderText>{`님이 `}</HeaderText>
        <HeaderBoldText>{clubData.name}</HeaderBoldText>
        <HeaderText>{` 가입을 희망합니다.`}</HeaderText>
      </Header>
      <Content style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <MessageView>
          <ContentText>{applyMessage}</ContentText>
        </MessageView>
      </Content>
      <Footer>
        <RejectButton onPress={reject}>
          <ButtonText>거절</ButtonText>
        </RejectButton>
        <AcceptButton onPress={approve}>
          <ButtonText>수락</ButtonText>
        </AcceptButton>
      </Footer>
    </Container>
  );
};

export default ClubApplication;
