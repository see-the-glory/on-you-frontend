import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Text, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { RefinedSchedule } from "../../types/club";

import { Feather, Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

const ModalContainer = styled.View`
  background-color: white;
  border-radius: 10px;
`;
const ModalHeader = styled.View`
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

const ModalDetailView = styled.View`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`;

const ModalDetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const ModalDetailItemView = styled.View`
  padding: 15px;
  justify-content: center;
`;

const ModalDetailItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ModalDetailText = styled.Text`
  font-size: 14px;
`;

const ModalDetailTitle = styled.Text`
  font-size: 14px;
  color: #79a0ab;
  font-weight: 600;
`;

const ModalFooter = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ModalApplyButton = styled.TouchableOpacity`
  background-color: #ff714b;
  padding: 10px 15px 10px 15px;
  border-radius: 10px;
`;

const ModalButtonText = styled.Text`
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

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visible,
  scheduleData,
  selectIndex,
  children,
}) => {
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
    <Modal
      transparent
      visible={showModal}
      supportedOrientations={["landscape", "portrait"]}
    >
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
            <ModalContainer>
              <ModalHeader>
                {children}
                <ScheduleText>{item.year}</ScheduleText>
                <ScheduleTitle>
                  {item.month}/{item.day} {item.dayOfWeek}
                </ScheduleTitle>
              </ModalHeader>
              <ModalDetailView>
                <ModalDetailHeader>
                  <ModalDetailItem>
                    <Feather
                      name="clock"
                      size={16}
                      color="#79A0AB"
                      style={{ marginRight: 7 }}
                    />
                    <ModalDetailText>{item.startTime}시</ModalDetailText>
                  </ModalDetailItem>
                  <ModalDetailItem>
                    <Feather
                      name="map-pin"
                      size={16}
                      color="#79A0AB"
                      style={{ marginRight: 7 }}
                    />
                    <ModalDetailText>{item.location}</ModalDetailText>
                  </ModalDetailItem>
                </ModalDetailHeader>
                <Break sep={0} />
                <ModalDetailItemView>
                  <ModalDetailItem style={{ paddingBottom: 15 }}>
                    <Ionicons
                      name="people-sharp"
                      size={16}
                      color="#79A0AB"
                      style={{ marginRight: 7 }}
                    />
                    <ModalDetailTitle>참석 멤버</ModalDetailTitle>
                  </ModalDetailItem>
                  <ModalDetailItem>
                    <Text>전부 참석</Text>
                  </ModalDetailItem>
                </ModalDetailItemView>
                <Break sep={0} />
              </ModalDetailView>
              <ModalFooter>
                <ModalApplyButton>
                  <ModalButtonText>참석하기</ModalButtonText>
                </ModalApplyButton>
              </ModalFooter>
            </ModalContainer>
          )}
        />
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;
