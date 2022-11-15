import React, { useLayoutEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { Calendar, CalendarProvider } from "react-native-calendars";
import CustomTextInput from "../../components/CustomTextInput";

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
  const [selectedDate, setSelectedDate] = useState(new Date().toString().split("T")[0]);
  const markedDate = {
    [selectedDate]: { selected: true },
  };
  console.log(markedDate);
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
              console.log(selectedDate);
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
              <TouchableItem>
                <ItemTitle>모임 시간</ItemTitle>
                <ItemText>오전 10시 00분</ItemText>
              </TouchableItem>
            </ItemView>
            <ItemView>
              <InputItem>
                <ItemTitle>모임 장소</ItemTitle>
                <ItemTextInput value={place} placeholder="직접 입력" maxLength={16} onChangeText={(text) => setPlace(text)} returnKeyType="done" returnKeyLabel="done" textAlign="right" />
              </InputItem>
            </ItemView>
            <MemoView>
              <ItemTitle>메모</ItemTitle>
              <MemoInput
                placeholder="스케줄에 대한 메모를 남겨주세요."
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
