import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { ChatStackParamList } from "../../../navigation/ChatStack";

const Container = styled.View`
  flex: 1;
`;

const ChatDetail: React.FC<NativeStackScreenProps<ChatStackParamList, "ChatDetail">> = ({ navigation: { setOptions, goBack }, route: { params } }) => {
  const messages = [
    {
      userId: 414,
      name: "장준용",
      thumbnail: "http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg",
      message: "형 이번 주 온유 모임",
      createdTime: "2023-06-20 00:05:17",
    },
    {
      userId: 414,
      name: "장준용",
      thumbnail: "https://onyou-bucket.s3.ap-northeast-2.amazonaws.com/c59e40b4-94d7-49e2-92ef-fbe2fc9cdeca.jpg",
      lastMessage: "어떻게 하지",
      createdTime: "2023-06-20 00:05:18",
    },
  ];

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return <Container></Container>;
};

export default ChatDetail;
