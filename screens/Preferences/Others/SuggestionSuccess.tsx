import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../../components/CustomText";
import BottomButton from "../../../components/BottomButton";

const SCREEN_PADDING_SIZE = 20;

const Container = styled.SafeAreaView`
  flex: 1;
`;
const Header = styled.View`
  margin: 15px 0px;
`;

const HeaderText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 16px;
  line-height: 21px;
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 65%;
  border: 1px solid #dcdcdc;
`;

const ContentText = styled(CustomText)`
  margin: 8px;
  color: #343434;
  font-size: 14px;
  line-height: 20px;
`;

const SuggestionSuccess = ({
  route: {
    params: { content },
  },
  navigation: { navigate, goBack, setOptions, pop },
}) => {
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <Header style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <HeaderText>{`소중한 의견이 온유 모임에 전송되었습니다.\n감사합니다.`}</HeaderText>
      </Header>
      <Content style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <MessageView>
          <ContentText>{content}</ContentText>
        </MessageView>
      </Content>
      <BottomButton title={`마이페이지로 돌아가기`} onPress={() => navigate("Profile")} backgroundColor={"#FF6534"} />
    </Container>
  );
};

export default SuggestionSuccess;