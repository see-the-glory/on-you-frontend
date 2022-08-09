import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Text, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { RefinedSchedule } from "../../types/club";

import { Feather, Ionicons, Entypo } from "@expo/vector-icons";
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

const ContentView = styled.View`
  width: 100%;
  padding: 10px 25px 10px 25px;
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
  font-size: 14px;
`;
const MemoScrollView = styled.ScrollView`
  width: 100%;
  height: 150px;
  padding: 10px;
`;
const Memo = styled.Text``;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: white;
  padding: 8px 60px 8px 60px;
  border: 1px solid #ff714b;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #ff714b;
`;

const Button = styled.TouchableOpacity`
  position: absolute;
  z-index: 1;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #295af5;
  border: 1px solid white;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
`;

const NextButton = styled(Button)`
  right: 0px;
  bottom: 48%;
  margin-right: -30px;
`;

const PrevButton = styled(Button)`
  left: 0px;
  bottom: 48%;
  margin-left: -30px;
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

interface ScheduleModalProps {
  visible: boolean;
  scheduleData: RefinedSchedule[];
  selectIndex: number;
  children: object;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, scheduleData, selectIndex, children }) => {
  const [carousel, setCarousel] = useState<Carousel<RefinedSchedule> | null>();
  const [showModal, setShowModal] = useState(visible);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
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
          ref={(c) => {
            setCarousel(c);
          }}
          data={scheduleData.slice(0, -1)}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_HEIGHT}
          itemWidth={SCREEN_WIDTH}
          slideStyle={{ paddingHorizontal: 40 }}
          contentContainerCustomStyle={{
            alignItems: "center",
          }}
          firstItem={selectIndex}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          renderItem={({ item, index }: { item: RefinedSchedule; index: number }) => (
            <Container>
              {index !== 0 ? (
                <PrevButton
                  onPress={() => {
                    carousel?.snapToPrev();
                  }}
                >
                  <Entypo name="chevron-left" size={34} color="white" />
                </PrevButton>
              ) : (
                <></>
              )}
              {index !== scheduleData.length - 2 ? (
                <NextButton
                  onPress={() => {
                    carousel?.snapToNext();
                  }}
                >
                  <Entypo name="chevron-right" size={34} color="white" />
                </NextButton>
              ) : (
                <></>
              )}

              <Header>
                {children}
                <ScheduleText>{item.year}</ScheduleText>
                <ScheduleTitle>
                  {item.month}/{item.day} {item.dayOfWeek}
                </ScheduleTitle>
              </Header>
              <ContentView>
                <ContentItemView>
                  <Feather name="clock" size={16} color="#6F6F6F" />
                  <ContentText>{item.startDate}</ContentText>
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Feather name="map-pin" size={16} color="#6F6F6F" />
                  <ContentText>{item.location}</ContentText>
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Feather name="user-check" size={16} color="#6F6F6F" />
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Ionicons name="checkmark-sharp" size={16} color="#6F6F6F" />
                  <ContentText>{`메모`}</ContentText>
                </ContentItemView>
                <MemoScrollView>
                  <Memo>{item.content}</Memo>
                </MemoScrollView>
                <Footer>
                  <ApplyButton>
                    <ButtonText>참석</ButtonText>
                  </ApplyButton>
                </Footer>
              </ContentView>
            </Container>
          )}
        />
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;
