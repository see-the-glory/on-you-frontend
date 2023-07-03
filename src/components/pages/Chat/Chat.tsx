import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Platform, StatusBar } from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "@navigation/Root";
import { MainBottomTabParamList } from "@navigation/Tabs";
import CircleIcon from "@components/atoms/CircleIcon";
import SearchButton from "@components/atoms/SearchButton";

const Container = styled.View`
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
  flex: 1;
`;

const Header = styled.View`
  margin-bottom: 10px;
`;
const Content = styled.View``;

const TitleSection = styled.View`
  height: 50px;
  padding: 0px 10px;
  justify-content: center;
`;

const SearchSection = styled.View`
  height: 40px;
  padding: 0px 10px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.englishSecondaryFontDB};
  font-size: 31px;
`;

const MessageWrap = styled.View`
  padding: 10px 10px;
  border-bottom-width: 0.5px;
  border-bottom-color: #e3e3e3;
`;
const MessageItem = styled.TouchableOpacity`
  flex-direction: row;
`;
const MessageContent = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const MessageContentTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MessageTitle = styled.Text`
  font-family: ${(props) => props.theme.koreanFontSB};
  font-size: 18px;
`;

const MessageBadge = styled.View`
  background-color: ${(props) => props.theme.accentColor};
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const MessageBadgeCount = styled.Text`
  font-size: 12px;
  color: white;
`;

const MessageContentBottom = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MessageText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  color: #a5a5a5;
`;

const MessageCreatedTime = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  color: #a5a5a5;
`;

const Chat: React.FC<NativeStackScreenProps<MainBottomTabParamList, "Chat">> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const DMs = [
    {
      userId: 414,
      name: "장준용",
      thumbnail: "http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg",
      lastMessage: "형 이번 주 온유 모임",
      createdTime: "2023-06-20 00:05:17",
      unReadCount: 3,
    },
    {
      userId: 3,
      name: "박종원",
      thumbnail: "https://onyou-bucket.s3.ap-northeast-2.amazonaws.com/c59e40b4-94d7-49e2-92ef-fbe2fc9cdeca.jpg",
      lastMessage: "진규야",
      createdTime: "2023-03-15 18:10:37",
      unReadCount: 0,
    },
  ];

  const goToChatDetail = () => {
    navigation.navigate("ChatStack", { screen: "ChatDetail" });
  };
  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header>
        <TitleSection>
          <Title>{`Chat`}</Title>
        </TitleSection>
        <SearchSection>
          <SearchButton onPress={() => {}} text="채팅방을 검색하세요." />
        </SearchSection>
      </Header>
      <Content>
        {DMs.map((dm, index) => (
          <MessageWrap key={`DM_${index}`}>
            <MessageItem onPress={goToChatDetail}>
              <CircleIcon uri={dm.thumbnail} size={45} kerning={10} />
              <MessageContent>
                <MessageContentTop>
                  <MessageTitle>{dm.name}</MessageTitle>
                  {dm.unReadCount > 0 ? (
                    <MessageBadge>
                      <MessageBadgeCount>{dm.unReadCount}</MessageBadgeCount>
                    </MessageBadge>
                  ) : null}
                </MessageContentTop>
                <MessageContentBottom>
                  <MessageText>{dm.lastMessage}</MessageText>
                  <MessageCreatedTime>{dm.createdTime}</MessageCreatedTime>
                </MessageContentBottom>
              </MessageContent>
            </MessageItem>
          </MessageWrap>
        ))}
      </Content>
    </Container>
  );
};

export default Chat;
