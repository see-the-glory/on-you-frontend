import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Modal, StatusBar, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 80%;
`;
const Header = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ff714b;
  padding-top: 15px;
  padding-bottom: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const HeaderText = styled.Text`
  font-size: 14px;
  color: white;
`;

const HeaderTitle = styled.Text`
  font-size: 21px;
  font-weight: 700;
  color: white;
`;

const DetailView = styled.View`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: center;
  align-items: flex-start;
`;

const DetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 15px;
`;

const DetailItemView = styled.View`
  padding: 15px;
  justify-content: center;
`;

const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DetailTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
`;

const DetailSubTitle = styled.Text`
  font-size: 14px;
  color: #5f83f7;
`;

const DetailText = styled.Text`
  font-size: 12px;
  color: #555555;
`;

const DetailTextInput = styled.TextInput`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 15px;
`;

const Footer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #295af5;
  padding: 10px 30px 10px 30px;
  border-radius: 12px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  height: 3px;
  margin-bottom: ${(props) => props.sep}px;
  margin-top: ${(props) => props.sep}px;
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
`;

interface ClubJoinModalProps {
  visible: boolean;
  clubName: string;
  clubSubmit: Function;
  children: object;
}

const ClubJoinModal: React.FC<ClubJoinModalProps> = ({ visible, clubName, clubSubmit, children }) => {
  const [showModal, setShowModal] = useState(visible);
  const [detailText, setDetailText] = useState<string>("");
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(opacity, {
        toValue: 1,
        speed: 20,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setShowModal(false), 200);
    }
  };

  return (
    <Modal transparent visible={showModal} supportedOrientations={["landscape", "portrait"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            opacity: opacity,
          }}
        >
          <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
          <Container>
            <Header>
              {children}
              <HeaderText>{clubName}</HeaderText>
              <HeaderTitle>모임 가입신청</HeaderTitle>
            </Header>
            <DetailView>
              <DetailHeader>
                <DetailTitle>{`모임의 가입 희망을 환영합니다!`}</DetailTitle>
              </DetailHeader>
              <Break sep={0} />
              <DetailItemView>
                <DetailItem>
                  <Ionicons name="checkmark-sharp" size={16} color="#8b8b8b" />
                  <DetailText>{` 본인소개`}</DetailText>
                </DetailItem>
                <DetailItem style={{ paddingTop: 10 }}>
                  <DetailTextInput
                    placeholder="모임장에게 전달할 내용을 적어주세요."
                    textAlign="left"
                    multiline={true}
                    maxLength={500}
                    textAlignVertical="top"
                    onChangeText={(text) => setDetailText(text)}
                  />
                </DetailItem>
              </DetailItemView>
              <Footer>
                <ApplyButton
                  onPress={() => {
                    clubSubmit(detailText);
                  }}
                >
                  <ButtonText>제출</ButtonText>
                </ApplyButton>
              </Footer>
            </DetailView>
          </Container>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ClubJoinModal;
