import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { Calendar } from "react-native-calendars";
import CustomTextInput from "../../components/CustomTextInput";
import Collapsible from "react-native-collapsible";
import DatePicker from "react-native-date-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const MainView = styled.ScrollView``;

const CalendarHeader = styled.View`
  align-items: center;
  padding: 10px 0px;
`;

const Content = styled.View`
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.1);
  padding: 0px 20px;
  margin-bottom: 300px;
`;

const ItemView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
`;

const TouchableItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0px;
`;

const InputItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0px;
`;

const ItemTitle = styled(CustomText)`
  font-size: 14px;
`;
const ItemText = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
  color: #6f6f6f;
`;

const ItemTextInput = styled(CustomTextInput)`
  font-size: 16px;
  line-height: 21px;
  color: #6f6f6f;
  flex: 1;
`;

const MemoView = styled.View`
  padding: 15px 0px;
`;

const MemoInput = styled(CustomTextInput)`
  margin-top: 15px;
  width: 100%;
  height: 300px;
  font-size: 12px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
`;

const ClubScheduleAdd = ({
  navigation: { navigate, setOptions },
  route: {
    params: { clubData },
  },
}) => {
  const [place, setPlace] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toString().split("T")[0]);
  const markedDate = {
    [selectedDate]: { selected: true },
  };
  const save = () => {};
  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <Container>
      <StatusBar barStyle={"default"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Calendar
            theme={{
              arrowColor: "#6F6F6F",
              dotColor: "#FF714B",
              selectedDayBackgroundColor: "#FF714B",
            }}
            markedDates={markedDate}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            renderHeader={(date) => (
              <CalendarHeader>
                <CustomText style={{ fontFamily: "NotoSansKR-Bold", fontSize: 18, lineHeight: 24 }}>{date.getMonth()}</CustomText>
                <CustomText style={{ fontSize: 12, color: "#737373" }}>{date.getFullYear()}</CustomText>
              </CalendarHeader>
            )}
          />
          <Content>
            <ItemView>
              <TouchableItem onPress={() => setShowDatePicker((prev) => !prev)}>
                <ItemTitle>모임 시간</ItemTitle>
                <ItemText>
                  {date.getHours() < 12 ? "오전" : "오후"} {date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? 12 : date.getHours()}시{" "}
                  {date.getMinutes().toString().padStart(2, "0")}분
                </ItemText>
              </TouchableItem>
            </ItemView>

            {Platform.OS === "android" ? (
              <Collapsible collapsed={!showDatePicker}>
                <ItemView style={{ width: "100%", alignItems: "center" }}>
                  <DatePicker date={date} mode="time" onDateChange={setDate} />
                </ItemView>
              </Collapsible>
            ) : (
              <Collapsible collapsed={!showDatePicker}>
                <ItemView>
                  <RNDateTimePicker mode="time" value={date} display="spinner" onChange={(_, value: Date) => setDate(value)} />
                </ItemView>
              </Collapsible>
            )}

            <ItemView>
              <InputItem>
                <ItemTitle>모임 장소</ItemTitle>
                <ItemTextInput
                  value={place}
                  placeholder="직접 입력"
                  placeholderTextColor="#B0B0B0"
                  maxLength={16}
                  onChangeText={(text) => setPlace(text)}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  textAlign="right"
                />
              </InputItem>
            </ItemView>
            <MemoView>
              <ItemTitle>메모</ItemTitle>
              <MemoInput
                placeholder="스케줄에 대한 메모를 남겨주세요."
                placeholderTextColor="#B0B0B0"
                value={memo}
                textAlign="left"
                multiline={true}
                maxLength={1000}
                textAlignVertical="top"
                onChangeText={(value: string) => setMemo(value)}
              />
            </MemoView>
          </Content>
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubScheduleAdd;
