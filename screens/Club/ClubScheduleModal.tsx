import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, TouchableOpacity, useWindowDimensions } from "react-native";
import { RefinedSchedule } from "../../Types/Club";
import { Feather, Ionicons, Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import Carousel from "../../components/Carousel";

const ModalContainer = styled.View`
  height: 480px;
  justify-content: center;
  align-items: center;
`;
const Container = styled.View<{ pageWidth: number; gap: number }>`
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: ${(props: any) => props.pageWidth}px;
  margin: 0px ${(props: any) => props.gap / 2}px;
`;
const Header = styled.View<{ index: number }>`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${(props: any) => (props.index === 0 ? "#eaff87" : "#CCCCCC")};
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

const Content = styled.View`
  width: 100%;
  padding: 0px 20px;
  align-items: flex-start;
`;

const ContentItemView = styled.View`
  flex-direction: row;
  padding: 8px 8px;
  align-items: center;
  justify-content: center;
`;

const ContentText = styled(CustomText)`
  padding: 0px 10px;
  font-size: 10px;
  line-height: 15px;
  color: #6f6f6f;
`;
const MemoScrollView = styled.ScrollView`
  width: 100%;
  height: 200px;
  padding: 0px 8px;
`;
const Memo = styled(CustomText)`
  color: #6f6f6f;
  font-size: 10px;
  line-height: 15px;
`;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  margin: 20px 0px;
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
  margin-bottom: ${(props: any) => props.sep}px;
  margin-top: ${(props: any) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
`;

interface ScheduleModalProps {
  visible: boolean;
  scheduleData?: RefinedSchedule[];
  selectIndex: number;
  closeModal: any;
  children: object;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, scheduleData, selectIndex, closeModal, children }) => {
  const [showModal, setShowModal] = useState(visible);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const gap = 32;
  const offset = 12;
  const pageWidth = SCREEN_WIDTH - (gap + offset) * 2;
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
    <Modal transparent visible={showModal} onRequestClose={closeModal} supportedOrientations={["landscape", "portrait"]}>
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
        <ModalContainer>
          <Carousel
            gap={gap}
            offset={offset}
            pageWidth={pageWidth}
            pages={scheduleData?.slice(0, -1)}
            keyExtractor={(item: RefinedSchedule, index: number) => String(index)}
            initialScrollIndex={selectIndex}
            renderItem={({ item, index }: { item: RefinedSchedule; index: number }) => (
              <Container pageWidth={pageWidth} gap={gap}>
                <Header index={index}>
                  {children}
                  <ScheduleText>{item.year}</ScheduleText>
                  <ScheduleTitle>
                    {item.month}/{item.day} {item.dayOfWeek}
                  </ScheduleTitle>
                </Header>
                <Content>
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
                </Content>
                <Footer>
                  <ApplyButton
                    onPress={() => {
                      console.log(item);
                      console.log(`attend: ${item.id}`);
                    }}
                  >
                    <ButtonText>참석</ButtonText>
                  </ApplyButton>
                </Footer>
              </Container>
            )}
          />
        </ModalContainer>
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;
