import React from "react";
import { Platform, StatusBar, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, UserApi } from "../../api";

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 0px 20px 0px;
`;

const ModalHeader = styled.View<{ padding: number }>`
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
  margin-bottom: 15px;
`;
const ModalHeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 20px;
  line-height: 22px;
  margin-bottom: 5px;
`;
const ModalHeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #a0a0a0;
`;

const OptionButton = styled.TouchableOpacity<{ height: number; padding: number; alignItems: string }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: ${(props: any) => (props.alignItems ? props.alignItems : "center")};
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
`;
const OptionName = styled.Text<{ warning?: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  line-height: 18px;
  color: ${(props: any) => (props.warning ? "#FF551F" : "#2b2b2b")};
`;
const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props: any) => props.sep}px;
  margin-top: ${(props: any) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  opacity: 0.5;
`;
interface ProfileReportModalProps {
  modalRef: any;
  userId?: number;
  userName?: string;
  buttonHeight: number;
}

const ProfileReportModal: React.FC<ProfileReportModalProps> = ({ modalRef, userId, userName, buttonHeight }) => {
  const toast = useToast();

  // const reportMutation = useMutation<BaseResponse, ErrorResponse, UserReportRequest>(UserApi.reportUser, {
  //   onSuccess: (res) => {
  //     toast.show(`신고 처리가 완료 되었습니다.`, { type: "success" });
  //     modalRef.current?.close();
  //   },
  //   onError: (error) => {
  //     console.log(`API ERROR | reportUser ${error.code} ${error.status}`);
  //     toast.show(`${error.message ?? error.code}`, { type: "warning" });
  //   },
  // });

  const complainOptionList = [
    { name: "이단 및 사이비 종교", reason: "HERESY" },
    { name: "기타", reason: "ETC" },
  ];
  const modalHeight = buttonHeight * complainOptionList.length + 145;

  const reportSubmit = (reason: string) => {
    if (!userId || !userName) {
      toast.show("유저 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }
    const requestData = {
      userId,
      data: { reason },
    };
    // reportMutation.mutate(requestData);
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={modalHeight}
        handlePosition="inside"
        handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
        modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onOpen={() => {
          if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("black", true);
            StatusBar.setBarStyle("light-content", true);
          }
        }}
        onClose={() => {
          if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white", true);
            StatusBar.setBarStyle("dark-content", true);
          }
        }}
      >
        <ModalContainer style={{ flex: 1 }}>
          <ModalHeader padding={20}>
            <ModalHeaderTitle>신고가 필요한 게시물인가요?</ModalHeaderTitle>
            <ModalHeaderText>신고유형을 선택해주세요. 관리자에게 신고 접수가 진행됩니다.</ModalHeaderText>
          </ModalHeader>
          {complainOptionList.map((option, index) => (
            <View key={`complainOption_${index}`}>
              {index > 0 ? <Break sep={1} /> : <></>}
              <OptionButton onPress={() => reportSubmit(option.reason)} height={buttonHeight} padding={20} alignItems={"flex-start"}>
                <OptionName>{option.name}</OptionName>
              </OptionButton>
            </View>
          ))}
        </ModalContainer>
      </Modalize>
    </Portal>
  );
};
export default ProfileReportModal;
