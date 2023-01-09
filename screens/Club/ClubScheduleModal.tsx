import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, useWindowDimensions } from "react-native";
import { RefinedSchedule } from "../../Types/Club";
import { Feather, Ionicons, Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import Carousel from "../../components/Carousel";
import { useMutation } from "react-query";
import { ClubApi, ClubScheduleJoinOrCancelRequest } from "../../api";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import CircleIcon from "../../components/CircleIcon";
import CircleIconBundle from "../../components/CircleIconBundle";

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
  height: 30px;
  flex-direction: row;
  padding: 8px 8px;
  align-items: center;
  justify-content: center;
`;
const ContentCollapsibleView = styled.View`
  flex-direction: row;
  justify-content: center;
  padding-left: 10px;
`;

const ContentMemberView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const ContentText = styled(CustomText)`
  padding: 0px 10px;
  font-size: 10px;
  line-height: 15px;
  color: #6f6f6f;
`;

const ContentSubText = styled(CustomText)`
  font-size: 9px;
  line-height: 15px;
  color: #8e8e8e;
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

const ApplyButton = styled.TouchableOpacity<{ participation: boolean }>`
  width: 130px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => (props.participation ? "#ff714b" : "white")};
  padding: 5px 0px;
  border: 1px solid #ff714b;
`;

const ButtonText = styled(CustomText)<{ participation: boolean }>`
  font-size: 12px;
  line-height: 16px;
  font-family: "NotoSansKR-Medium";
  color: ${(props: any) => (props.participation ? "white" : "#ff714b")};
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
  clubId: number;
  scheduleData?: RefinedSchedule[];
  selectIndex: number;
  closeModal: any;
  children: object;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, clubId, scheduleData, selectIndex, closeModal, children }) => {
  const toast = useToast();
  const token = useSelector((state) => state.AuthReducers.authToken);
  const me = useSelector((state) => state.UserReducers.user);
  const [showModal, setShowModal] = useState(visible);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
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

  const mutation = useMutation(ClubApi.joinOrCancelClubSchedule, {
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const joinOrCancel = (index: number, scheduleId?: number) => {
    if (scheduleId === undefined) {
      return toast.show(`Schedule ID Error`, {
        type: "warning",
      });
    }
    let requestData: ClubScheduleJoinOrCancelRequest = {
      token,
      clubId,
      scheduleId,
    };

    mutation.mutate(requestData, {
      onSuccess: (res) => {
        console.log(res);
        if (scheduleData) {
          if (scheduleData[index].participation) {
            let target = scheduleData[index].members?.findIndex((member) => member.id === me?.id);
            console.log(target);
            if (target !== undefined && target > -1) scheduleData[index].members?.splice(target, 1);
          } else {
            scheduleData[index].members?.push(me);
          }
          scheduleData[index].participation = !scheduleData[index].participation;
        }
      },
    });
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
              <Container key={index} pageWidth={pageWidth} gap={gap}>
                <Header index={index}>
                  {children}
                  <ScheduleText>{item.year}</ScheduleText>
                  <ScheduleTitle>
                    {item.month}/{item.day} {item.dayOfWeek}
                  </ScheduleTitle>
                </Header>
                <Content>
                  <ContentItemView>
                    <Feather name="clock" size={13} color="black" />
                    <ContentText>
                      {`${item.ampm} ${item.hour}시`}
                      {item.minute !== "0" ? ` ${item.minute}분` : ""}
                    </ContentText>
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Feather name="map-pin" size={13} color="black" />
                    <ContentText>{item.location}</ContentText>
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Feather name="users" size={13} color="black" />
                    {item.participation || item.members?.length ? (
                      <ContentCollapsibleView>
                        {item.participation ? <CircleIcon size={18} uri={me.thumbnail} kerning={5} /> : <></>}
                        <CircleIconBundle size={18} kerning={-8} uris={item.members?.filter((member) => member.id != me.id).map((member) => member.thumbnail)} />
                      </ContentCollapsibleView>
                    ) : (
                      <ContentText>{`참여 멤버가 없습니다.`}</ContentText>
                    )}
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Ionicons name="checkmark-sharp" size={13} color="black" />
                    <ContentText>{`메모`}</ContentText>
                  </ContentItemView>
                  <MemoScrollView>
                    <Memo>{item.content}</Memo>
                  </MemoScrollView>
                </Content>
                <Footer>
                  <ApplyButton participation={item.participation} onPress={() => joinOrCancel(index, item.id)}>
                    {item.participation ? <ButtonText participation={item.participation}>참석 취소</ButtonText> : <ButtonText participation={item.participation}>참석</ButtonText>}
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
