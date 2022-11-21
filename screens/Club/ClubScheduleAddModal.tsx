import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, StatusBar, useWindowDimensions, Platform, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import styled from "styled-components/native";
import moment from "moment-timezone";
import { ClubScheduleCreationRequest } from "../../api";
import { useSelector } from "react-redux";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.View`
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 80%;
`;
const Header = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #eaff87;
  padding: 15px 0px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const HeaderTitle = styled(CustomText)`
  font-size: 16px;
  line-height: 22px;
  font-family: "NotoSansKR-Bold";
  color: black;
  padding: 5px 0px;
`;

const ContentView = styled.View`
  width: 100%;
  padding: 0px 20px;
  align-items: flex-start;
`;

const ContentItemView = styled.View`
  height: 35px;
  flex-direction: row;
  padding: 6px 8px;
  align-items: center;
`;

const ContentText = styled(CustomText)`
  padding: 0px 10px;
  font-size: 10px;
  line-height: 14px;
  color: #6f6f6f;
`;

const ContentTextInput = styled(CustomTextInput)`
  width: 100%;
  font-size: 10px;
  line-height: 14px;
  padding: 0px 10px;
`;

const MemoInput = styled(CustomTextInput)`
  width: 100%;
  height: 180px;
  border-radius: 10px;
  font-size: 10px;
  line-height: 12px;
  padding: 8px;
`;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  padding: 20px 0px;
`;

const ApplyButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: white;
  padding: 5px 50px;
  border: 1px solid ${(props) => (props.disabled ? "#D3D3D3" : "#295af5")};
`;

const ButtonText = styled(CustomText)<{ disabled: boolean }>`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => (props.disabled ? "#D3D3D3" : "#295af5")};
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props) => props.sep}px;
  margin-top: ${(props) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  opacity: 1;
`;

interface ScheduleAddModalProps {
  visible: boolean;
  mutation: any;
  clubId: number;
  children: object;
}

const ScheduleAddModal: React.FC<ScheduleAddModalProps> = ({ visible, mutation, clubId, children }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const [showModal, setShowModal] = useState(visible);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
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

  const onSubmit = () => {
    const startDate = moment(selectedDate).format("YYYY-MM-DDTHH:mm:ss");
    const endDate = `${startDate.split("T")[0]}T23:59:59`;

    const requestData: ClubScheduleCreationRequest = {
      token,
      body: {
        clubId,
        content,
        location,
        name: "test",
        startDate,
        endDate,
      },
    };
    mutation.mutate(requestData);
  };

  const showDateTimePicker = (mode: "date" | "time") => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      onChange: onChangeDate,
      mode,
      is24Hour: true,
    });
  };

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (date) setSelectedDate(date);
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
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
        <Container>
          <Header>
            {children}
            <HeaderTitle>일정 등록하기</HeaderTitle>
          </Header>
          <ContentView>
            <ContentItemView>
              <Ionicons name="calendar" size={16} color="black" style={{ marginRight: 10 }} />
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => showDateTimePicker("date")}>
                  <ContentText>{moment(selectedDate).format("YYYY-MM-DD")}</ContentText>
                </TouchableOpacity>
              ) : (
                <DateTimePicker value={selectedDate} mode="date" display="default" locale="ko-KR" onChange={onChangeDate} style={{ width: "50%" }} />
              )}
            </ContentItemView>
            <Break sep={0} />
            <ContentItemView>
              <Feather name="clock" size={16} color="black" style={{ marginRight: 10 }} />
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => showDateTimePicker("time")}>
                  <ContentText>{moment(selectedDate).format("A hh:mm")}</ContentText>
                </TouchableOpacity>
              ) : (
                <DateTimePicker value={selectedDate} mode="time" display="default" locale="ko-KR" onChange={onChangeDate} style={{ width: "50%" }} />
              )}
            </ContentItemView>
            <Break sep={0} />
            <ContentItemView>
              <Feather name="map-pin" size={16} color="black" style={{ marginRight: 10 }} />
              <ContentTextInput placeholder="모이는 장소" onChangeText={(value: string) => setLocation(value)} />
            </ContentItemView>
            <Break sep={0} />
            <ContentItemView>
              <Ionicons name="checkmark-sharp" size={16} color="black" style={{ marginRight: 10 }} />
              <ContentText>{`메모`}</ContentText>
            </ContentItemView>
            <MemoInput
              placeholder="모이는 날까지 해야하는 숙제 또는 당일 할 일을 메모해보세요."
              textAlign="left"
              multiline={true}
              maxLength={500}
              textAlignVertical="top"
              onChangeText={(value: string) => setContent(value)}
            />
            <Footer>
              <ApplyButton disabled={location === "" || content === ""} onPress={onSubmit}>
                <ButtonText disabled={location === "" || content === ""}>저장</ButtonText>
              </ApplyButton>
            </Footer>
          </ContentView>
        </Container>
      </Animated.View>
    </Modal>
  );
};

export default ScheduleAddModal;
