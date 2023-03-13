import React from "react";
import { Platform, StatusBar, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 0px 20px 0px;
`;

const ModalHeader = styled.View<{ padding: number }>`
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
  margin-bottom: 15px;
`;
const ModalHeaderTitle = styled(CustomText)`
  font-size: 20px;
  font-family: "NotoSansKR-Bold";
  line-height: 28px;
`;
const ModalHeaderText = styled(CustomText)`
  color: #a0a0a0;
`;

const OptionButton = styled.TouchableOpacity<{ height: number; padding: number; alignItems: string }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: ${(props: any) => (props.alignItems ? props.alignItems : "center")};
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
`;
const OptionName = styled(CustomText)<{ warning: boolean }>`
  font-size: 16px;
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
interface FeedReportModalProps {
  modalRef: any;
  buttonHeight: number;
  complainSubmit: (reason: string) => void;
}

const FeedReportModal: React.FC<FeedReportModalProps> = ({ modalRef, buttonHeight, complainSubmit }) => {
  const complainOptionList = [
    { name: "스팸", reason: "SPAM" },
    { name: "나체 이미지 또는 성적 이미지", reason: "SEXUAL" },
    { name: "사기 또는 거짓", reason: "FRAUD" },
    { name: "혐오 발언 또는 혐오 이미지", reason: "HATRED" },
    { name: "폭력, 괴롭힘", reason: "VIOLENCE" },
    { name: "기타", reason: "ETC" },
  ];
  const modalHeight = buttonHeight * complainOptionList.length + 145;

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
              <OptionButton onPress={() => complainSubmit(option.reason)} height={buttonHeight} padding={20} alignItems={"flex-start"}>
                <OptionName>{option.name}</OptionName>
              </OptionButton>
            </View>
          ))}
        </ModalContainer>
      </Modalize>
    </Portal>
  );
};
export default FeedReportModal;
