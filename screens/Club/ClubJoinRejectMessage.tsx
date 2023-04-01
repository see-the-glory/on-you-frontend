import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

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
  font-size: 16px;
  line-height: 21px;
`;
const HeaderBoldText = styled(HeaderText)`
  font-family: "NotoSansKR-Bold";
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 250px;
  border: 1px solid #dcdcdc;
`;

const CreatedTimeView = styled.View`
  justify-content: center;
  align-items: flex-end;
`;
const CreatedTimeText = styled(CustomText)`
  color: #8e8e8e;
`;
const ContentText = styled(CustomText)`
  margin: 8px;
  color: #343434;
  font-size: 14px;
  line-height: 20px;
`;

const ClubJoinRejectMessage = ({
  route: {
    params: { clubName, message, createdTime },
  },
  navigation: { navigate, goBack, setOptions },
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
        <HeaderBoldText>{clubName}</HeaderBoldText>
        <HeaderText>{`에서 모임가입 거절 메시지가 왔습니다.`}</HeaderText>
      </Header>
      <Content style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <MessageView>
          <ContentText>{message}</ContentText>
        </MessageView>
        <CreatedTimeView>
          <CreatedTimeText>{moment(createdTime).tz("Asia/Seoul").format("YYYY-MM-DD  A h시 mm분")}</CreatedTimeText>
        </CreatedTimeView>
      </Content>
    </Container>
  );
};

export default ClubJoinRejectMessage;
