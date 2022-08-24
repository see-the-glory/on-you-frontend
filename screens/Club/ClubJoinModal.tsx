import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Modal, StatusBar, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import styled from "styled-components/native";
import CustomTextInput from "../../components/CustomTextInput";

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

const HeaderText = styled(CustomText)`
  font-size: 12px;
  color: white;
`;

const HeaderTitle = styled(CustomText)`
  font-size: 17px;
  color: white;
  font-family: "NotoSansKR-Bold";
  line-height: 24px;
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
  padding: 10px;
`;

const DetailItemView = styled.View`
  padding: 10px;
  justify-content: center;
`;

const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DetailTitle = styled(CustomText)`
  font-size: 12px;
  font-family: "NotoSansKR-Bold";
  line-height: 20px;
`;

const DetailText = styled(CustomText)`
  font-size: 10px;
  color: #555555;
`;

const DetailTextInput = styled(CustomTextInput)`
  width: 100%;
  height: 170px;
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 11px;
  padding: 10px;
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
  padding: 5px 30px;
  border-radius: 10px;
`;

const ButtonText = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Bold";
  line-height: 19px;
  color: white;
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props) => props.sep}px;
  margin-top: ${(props) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  opacity: 1;
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
