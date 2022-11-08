import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { Calendar } from "react-native-calendars";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const MainView = styled.ScrollView``;

const CalendarHeader = styled.View`
  align-items: center;
  padding: 10px 0px;
`;

const ClubScheduleAdd = ({
  navigation: { navigate, setOptions },
  route: {
    params: { clubData },
  },
}) => {
  const [markedDate, setMarkedDate] = useState({});
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
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              setMarkedDate((prev) => (prev[day.dateString] === undefined ? Object.assign(prev, { [day.dateString]: { selected: true, selectedColor: "#FF714B" } }) : delete prev[day.dateString]));
              console.log(markedDate);
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {
              console.log("selected day", day);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"yyyy MM"}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {
              console.log("month changed", month);
            }}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={(addMonth) => addMonth()}
            // Replace default month and year title with custom one. the function receive a date as parameter
            renderHeader={(date) => (
              /*Return JSX*/
              <CalendarHeader>
                <CustomText style={{ fontFamily: "NotoSansKR-Bold", fontSize: 18, lineHeight: 24 }}>{date.getMonth()}</CustomText>
                <CustomText style={{ fontSize: 12, color: "#737373" }}>{date.getFullYear()}</CustomText>
              </CalendarHeader>
            )}
          />
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubScheduleAdd;
