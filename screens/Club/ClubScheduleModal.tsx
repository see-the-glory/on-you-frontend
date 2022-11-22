import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, useWindowDimensions } from "react-native";
// import Carousel from "react-native-snap-carousel";
import { RefinedSchedule } from "../../Types/Club";
import { Feather, Ionicons, Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  elevation: 1;
`;
const Header = styled.View<{ index: number }>`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${(props) => (props.index === 0 ? "#eaff87" : "#CCCCCC")};
  padding-top: 10px;
  padding-bottom: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ScheduleText = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
`;

const ScheduleTitle = styled(CustomText)`
  font-size: 26px;
  font-family: "NotoSansKR-Bold";
  line-height: 32px;
`;

const ContentView = styled.View`
  width: 100%;
  padding: 10px 20px;
  align-items: flex-start;
`;

const ContentItemView = styled.View`
  flex-direction: row;
  padding: 6px 8px;
  align-items: center;
`;

const ContentText = styled(CustomText)`
  padding: 0px 10px;
  font-size: 10px;
  line-height: 15px;
  color: #6f6f6f;
`;
const MemoScrollView = styled.ScrollView`
  width: 100%;
  height: 210px;
  padding: 10px;
`;
const Memo = styled(CustomText)`
  color: #6f6f6f;
  font-size: 10px;
  line-height: 15px;
`;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  padding: 10px 0px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: white;
  padding: 5px 50px;
  border: 1px solid #ff714b;
`;

const ButtonText = styled(CustomText)`
  font-size: 12px;
  line-height: 16px;
  font-family: "NotoSansKR-Bold";

  color: #ff714b;
`;

const NextButton = styled(Entypo)`
  position: absolute;
  box-shadow: 1px 3px 2px black;
  right: 0px;
  bottom: 48%;
  margin-right: -40px;
`;

const PrevButton = styled(Entypo)`
  position: absolute;
  box-shadow: 1px 3px 2px black;
  left: 0px;
  bottom: 48%;
  margin-left: -40px;
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
          zIndex: 1,
        }}
      >
        {/* <Carousel
          ref={(c) => {
            setCarousel(c);
          }}
          data={scheduleData.slice(0, -1)}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_HEIGHT}
          itemWidth={SCREEN_WIDTH}
          slideStyle={{ paddingHorizontal: 50 }}
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
                  name="chevron-left"
                  size={34}
                  color="white"
                  onPress={() => {
                    carousel?.snapToPrev();
                  }}
                />
              ) : (
                <></>
              )}
              {index !== scheduleData.length - 2 ? (
                <NextButton
                  name="chevron-right"
                  size={34}
                  color="white"
                  onPress={() => {
                    carousel?.snapToNext();
                  }}
                />
              ) : (
                <></>
              )}

              <Header index={selectIndex}>
                {children}
                <ScheduleText>{item.year}</ScheduleText>
                <ScheduleTitle>
                  {item.month}/{item.day} {item.dayOfWeek}
                </ScheduleTitle>
              </Header>
              <ContentView>
                <ContentItemView>
                  <Feather name="clock" size={16} color="black" />
                  <ContentText>
                    {`${item.ampm} ${item.hour}시`}
                    {item.minute !== "0" ? ` ${item.minute}분` : ""}
                  </ContentText>
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Feather name="map-pin" size={16} color="black" />
                  <ContentText>{item.location}</ContentText>
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Feather name="users" size={16} color="black" />
                </ContentItemView>
                <Break sep={0} />
                <ContentItemView>
                  <Ionicons name="checkmark-sharp" size={16} color="black" />
                  <ContentText>{`메모`}</ContentText>
                </ContentItemView>
                <MemoScrollView>
                  <Memo>{item.content}</Memo>
                </MemoScrollView>
                <Footer>
                  <ApplyButton
                    onPress={() => {
                      console.log("attend");
                    }}
                  >
                    <ButtonText>참석</ButtonText>
                  </ApplyButton>
                </Footer>
              </ContentView>
            </Container>
          )}
        /> */}
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;
