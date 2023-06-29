import React from "react";
import { Alert, Platform, StatusBar, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, UserApi, UserBlockRequest } from "api";

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 0px 20px 0px;
`;

const OptionButton = styled.TouchableOpacity<{ height: number; padding?: number; alignItems?: string; disabled: boolean }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: ${(props: any) => (props.alignItems ? props.alignItems : "center")};
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
  opacity: ${(props: any) => (props.disabled ? 0.2 : 1)};
`;
const OptionName = styled.Text<{ warning: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontM};
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

interface ProfileOptionModalProps {
  modalRef: any;
  userId?: number;
  userName?: string;
  buttonHeight: number;
  openShareProfile?: () => void;
  openReportModal?: () => void;
}

const ProfileOptionModal: React.FC<ProfileOptionModalProps> = ({ modalRef, userId, userName, buttonHeight, openShareProfile, openReportModal }) => {
  const toast = useToast();

  const blockUserMutation = useMutation<BaseResponse, ErrorResponse, UserBlockRequest>(UserApi.blockUser, {
    onSuccess: (res) => {
      toast.show(`사용자를 차단했습니다.`, { type: "success" });
      modalRef.current?.close();
    },
    onError: (error) => {
      console.log(`API ERROR | blockUser ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const blockUser = () => {
    if (!userId || !userName) {
      toast.show("유저 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }

    const requestData: UserBlockRequest = { userId };

    Alert.alert(
      `${userName}님을 차단하시겠어요?`,
      `${userName}님의 게시글을 볼 수 없게 됩니다. 상대방에게는 회원님이 차단했다는 정보를 알리지 않습니다.`,
      [
        {
          text: "아니요",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            blockUserMutation.mutate(requestData);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const feedOptionList = [
    { name: "프로필 공유하기", active: true, warning: false, onPress: openShareProfile },
    { name: "신고", active: true, warning: false, onPress: openReportModal },
    { name: "사용자 차단", active: true, warning: true, onPress: blockUser },
  ];
  const modalHeight = buttonHeight * feedOptionList.length + 60;

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
          {feedOptionList.map((option, index) => (
            <View key={`ProfileOption_${index}`}>
              {index > 0 ? <Break sep={1} /> : <></>}
              <OptionButton onPress={option.onPress} disabled={!option.active} height={buttonHeight}>
                <OptionName warning={option.warning}>{option.name}</OptionName>
              </OptionButton>
            </View>
          ))}
        </ModalContainer>
      </Modalize>
    </Portal>
  );
};
export default ProfileOptionModal;
