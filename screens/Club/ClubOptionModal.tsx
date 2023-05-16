import React from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import styled from "styled-components/native";

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 0px 20px 0px;
`;

const OptionButton = styled.TouchableOpacity<{ height: number; padding: number; alignItems: string; disabled: boolean }>`
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

interface ClubOptionModalProps {
  modalRef: any;
  buttonHeight: number;
  isMyClub: boolean;
  isMyClubPost?: boolean;
  goToClubEdit?: () => void;
  openShareJoin?: () => void;
  goToReportClub?: () => void;
  openShare?: () => void;
}

const ClubOptionModal: React.FC<ClubOptionModalProps> = ({ modalRef, buttonHeight, isMyClub, isMyClubPost, goToClubEdit, openShareJoin, goToReportClub, openShare }) => {
  const clubOptionList = isMyClub
    ? [
        { name: "모임 링크 공유", active: true, warning: false, onPress: openShare },
        { name: "가입신청서 공유", active: false, warning: false, onPress: openShareJoin },
        { name: "모임 정보 수정", active: true, warning: false, onPress: goToClubEdit },
      ]
    : [
        { name: "모임 링크 공유", active: true, warning: false, onPress: openShare },
        { name: "신고하기", active: true, warning: false, onPress: goToReportClub },
      ];
  const modalHeight = buttonHeight * clubOptionList.length + 60;

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={modalHeight}
        handlePosition="inside"
        handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
        modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        <ModalContainer style={{ flex: 1 }}>
          {clubOptionList.map((option, index) => (
            <View key={`ClubOption_${index}`}>
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
export default ClubOptionModal;
