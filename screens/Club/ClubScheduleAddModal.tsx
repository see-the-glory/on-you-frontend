import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Modal, StatusBar, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 80%;
  height: 63%;
`;
const Header = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #eaff87;
  padding-top: 15px;
  padding-bottom: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const HeaderTitle = styled.Text`
  font-size: 21px;
  font-weight: 700;
  color: black;
`;

const ContentView = styled.View`
  width: 100%;
  padding: 10px 20px 10px 20px;
  align-items: flex-start;
`;

const ContentItemView = styled.View`
  flex-direction: row;
  padding: 10px;
  align-items: center;
`;

const ContentText = styled.Text`
  padding-left: 10px;
  padding-right: 10px;
  font-size: 12px;
  color: #6f6f6f;
`;

const ContentTextInput = styled.TextInput`
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
`;

const MemoInput = styled.TextInput`
  width: 100%;
  height: 40%;
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 8px;
`;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: white;
  padding: 8px 60px 8px 60px;
  border: 1px solid #295af5;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #295af5;
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

interface ScheduleAddModalProps {
  visible: boolean;
  children: object;
}

const ScheduleAddModal: React.FC<ScheduleAddModalProps> = ({ visible, children }) => {
  const [showModal, setShowModal] = useState(visible);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
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
              <HeaderTitle>일정 등록하기</HeaderTitle>
            </Header>
            <ContentView>
              <ContentItemView>
                <Ionicons name="calendar" size={16} color="#6F6F6F" />
                <ContentTextInput placeholder="모이는 날짜" onChangeText={(text) => setDate(text)} />
              </ContentItemView>
              <Break sep={0} />
              <ContentItemView>
                <Feather name="clock" size={16} color="#6F6F6F" />
                <ContentTextInput placeholder="모이는 시간" onChangeText={(text) => setTime(text)} />
              </ContentItemView>
              <Break sep={0} />
              <ContentItemView>
                <Feather name="map-pin" size={16} color="#6F6F6F" />
                <ContentTextInput placeholder="모이는 장소" onChangeText={(text) => setPlace(text)} />
              </ContentItemView>
              <Break sep={0} />
              <ContentItemView>
                <Ionicons name="checkmark-sharp" size={16} color="#6F6F6F" />
                <ContentText>{`메모`}</ContentText>
              </ContentItemView>

              <MemoInput
                placeholder="모이는 날까지 해야하는 숙제 또는 당일 할 일을 메모해보세요."
                textAlign="left"
                multiline={true}
                maxLength={500}
                textAlignVertical="top"
                onChangeText={(text) => setMemo(text)}
              />
              <Footer>
                <ApplyButton
                  onPress={() => {
                    console.log(`${date} ${time} ${place} ${memo}`);
                  }}
                >
                  <ButtonText>저장</ButtonText>
                </ApplyButton>
              </Footer>
            </ContentView>
          </Container>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ScheduleAddModal;
