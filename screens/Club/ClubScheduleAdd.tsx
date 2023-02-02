import React, { useLayoutEffect, useState } from "react";
import { DeviceEventEmitter, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { Calendar } from "react-native-calendars";
import CustomTextInput from "../../components/CustomTextInput";
import Collapsible from "react-native-collapsible";
import DatePicker from "react-native-date-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { ClubApi, ClubScheduleCreationRequest } from "../../api";
import { useMutation } from "react-query";
import moment from "moment";
import { RootState } from "../../redux/store/reducers";

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
  navigation: { navigate, goBack, setOptions },
  route: {
    params: { clubData },
  },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [place, setPlace] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState(new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss")));
  const [selectedDate, setSelectedDate] = useState<string>("");
  const markedDate = {
    [selectedDate]: { selected: true },
  };

  const scheduleMutation = useMutation(ClubApi.createClubSchedule, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        toast.show("일정 등록이 완료되었습니다.", {
          type: "success",
        });
        DeviceEventEmitter.emit("SchedulesRefetch");
        goBack();
      } else {
        toast.show("일정 등록에 실패했습니다.", {
          type: "warning",
        });
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
      }
    },
    onError: (error) => {
      toast.show("일정 등록에 실패했습니다.", {
        type: "warning",
      });
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
  });

  const save = () => {
    /** Data Validation */
    let validate = true;
    let dangerMsg = "";
    if (selectedDate === "") {
      validate = false;
      dangerMsg = "달력에서 날짜를 선택하세요.";
    } else if (place === "") {
      validate = false;
      dangerMsg = "모임 장소를 입력하세요.";
    } else if (memo === "") {
      validate = false;
      dangerMsg = "메모를 입력하세요.";
    }

    if (!validate) {
      toast.show(dangerMsg, {
        type: "danger",
      });
      return;
    }

    const startDate = `${selectedDate}T${dateTime.toTimeString().split(" ")[0]}`;
    const endDate = `${startDate.split("T")[0]}T23:59:59`;

    const requestData: ClubScheduleCreationRequest = {
      token,
      body: {
        clubId: clubData.id,
        content: memo,
        location: place,
        name: "schedule",
        startDate,
        endDate,
      },
    };

    console.log(requestData);
    scheduleMutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
        </TouchableOpacity>
      ),
    });
  }, [selectedDate, dateTime, place, memo]);

  return (
    <Container>
      <StatusBar barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Calendar
            theme={{
              arrowColor: "#6F6F6F",
              dotColor: "#FF714B",
              selectedDayBackgroundColor: "#FF714B",
              todayTextColor: "#FF714B",
            }}
            minDate={dateTime.toString()}
            context={{ date: "" }}
            markedDates={markedDate}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            renderHeader={(date) => (
              <CalendarHeader>
                <CustomText style={{ fontFamily: "NotoSansKR-Bold", fontSize: 18, lineHeight: 24 }}>{date.getMonth() + 1}</CustomText>
                <CustomText style={{ fontSize: 12, color: "#737373" }}>{date.getFullYear()}</CustomText>
              </CalendarHeader>
            )}
          />
          <Content>
            <ItemView>
              <TouchableItem onPress={() => setShowDatePicker((prev) => !prev)}>
                <ItemTitle>모임 시간</ItemTitle>
                <ItemText>
                  {dateTime.getHours() < 12 ? "오전" : "오후"} {dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours() === 0 ? 12 : dateTime.getHours()}시{" "}
                  {dateTime.getMinutes().toString().padStart(2, "0")}분
                </ItemText>
              </TouchableItem>
            </ItemView>

            {Platform.OS === "android" ? (
              <Collapsible collapsed={!showDatePicker}>
                <ItemView style={{ width: "100%", alignItems: "center" }}>
                  <DatePicker date={dateTime} mode="time" onDateChange={setDateTime} textColor="black" />
                </ItemView>
              </Collapsible>
            ) : (
              <Collapsible collapsed={!showDatePicker}>
                <ItemView>
                  <RNDateTimePicker mode="time" value={dateTime} display="spinner" onChange={(_, value: Date) => setDateTime(value)} textColor="black" />
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
                  onChangeText={(text: string) => setPlace(text)}
                  onEndEditing={() => setPlace((prev) => prev.trim())}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  textAlign="right"
                  includeFontPadding={false}
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
                onEndEditing={() => setMemo((prev) => prev.trim())}
                includeFontPadding={false}
              />
            </MemoView>
          </Content>
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubScheduleAdd;
