import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Text, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { RefinedSchedule } from "../../types/club";

import { Feather, Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: white;
  border-radius: 10px;
`;
const Header = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #eaff87;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ScheduleText = styled.Text`
  font-size: 16px;
`;

const ScheduleTitle = styled.Text`
  font-size: 26px;
  font-weight: 600;
`;

const DetailView = styled.View`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`;

const DetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const DetailItemView = styled.View`
  padding: 15px;
  justify-content: center;
`;

const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DetailText = styled.Text`
  font-size: 14px;
`;

const DetailTitle = styled.Text`
  font-size: 14px;
  color: #79a0ab;
  font-weight: 600;
`;

const Footer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #ff714b;
  padding: 10px 15px 10px 15px;
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const Break = styled.View<{ sep: number }>`
  margin-bottom: ${(props) => props.sep}px;
  margin-top: ${(props) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
`;

interface ScheduleModalProps {
  visible: boolean;
  scheduleData: RefinedSchedule[];
  selectIndex: number;
  children: object;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, scheduleData, selectIndex, children }) => {
  const [showModal, setShowModal] = useState(visible);
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
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          opacity: opacity,
        }}
      >
        <Carousel
          data={scheduleData}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH * 0.8}
          contentContainerCustomStyle={{
            alignItems: "center",
          }}
          firstItem={selectIndex}
          inactiveSlideOpacity={1}
          renderItem={({ item }: { item: RefinedSchedule }) => (
            <Container>
              <Header>
                {children}
                <ScheduleText>{item.year}</ScheduleText>
                <ScheduleTitle>
                  {item.month}/{item.day} {item.dayOfWeek}
                </ScheduleTitle>
              </Header>
              <DetailView>
                <DetailHeader>
                  <DetailItem>
                    <Feather name="clock" size={16} color="#79A0AB" style={{ marginRight: 7 }} />
                    <DetailText>{item.startTime}시</DetailText>
                  </DetailItem>
                  <DetailItem>
                    <Feather name="map-pin" size={16} color="#79A0AB" style={{ marginRight: 7 }} />
                    <DetailText>{item.location}</DetailText>
                  </DetailItem>
                </DetailHeader>
                <Break sep={0} />
                <DetailItemView>
                  <DetailItem style={{ paddingBottom: 15 }}>
                    <Ionicons name="people-sharp" size={16} color="#79A0AB" style={{ marginRight: 7 }} />
                    <DetailTitle>참석 멤버</DetailTitle>
                  </DetailItem>
                  <DetailItem>
                    <Text>전부 참석</Text>
                  </DetailItem>
                </DetailItemView>
                <Break sep={0} />
              </DetailView>
              <Footer>
                <ApplyButton>
                  <ButtonText>참석하기</ButtonText>
                </ApplyButton>
              </Footer>
            </Container>
          )}
        />
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;
