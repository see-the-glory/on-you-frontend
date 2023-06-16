import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { Platform, View } from "react-native";
import { ClubRole } from "../../api";
import Lottie from "lottie-react-native";
import { lightTheme } from "../../theme";
import { Iconify } from "react-native-iconify";

const Container = styled.View<{ height: number }>`
  position: absolute;
  flex-direction: row;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  width: 100%;
  height: ${(props: any) => props.height}px;
  bottom: 0px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: ${Platform.OS === "ios" ? 18 : 10}px;
`;

const SectionLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const SectionRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LottieButton = styled.TouchableOpacity`
  margin-right: 16px;
`;
const IconButton = styled.TouchableOpacity`
  padding: 5px;
  margin-right: 16px;
`;

const Button = styled.TouchableOpacity<{ isJoined: boolean }>`
  padding: 8px 15px;
  background-color: ${(props: any) => (props.isJoined ? props.theme.accentColor : props.theme.primaryColor)};
  border-radius: 20px;
`;
const ButtonText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 18px;
  line-height: 22px;
  color: white;
`;

export interface ClubHomeFloatingButtonProps {
  height: number;
  role?: ClubRole | null;
  recruitStatus?: "OPEN" | "CLOSE" | null;
  openShare: () => void;
  goToClubJoin: () => void;
  goToFeedCreation: () => void;
}

const FloatingActionButton: React.FC<ClubHomeFloatingButtonProps> = ({ height, role, recruitStatus, openShare, goToClubJoin, goToFeedCreation }) => {
  const [like, setLike] = useState<boolean>(false);
  const heartRef = useRef<Lottie>(null);
  const isJoined = role?.applyStatus === "APPROVED" ? true : false;

  const onPressHeart = () => {
    if (like) heartRef.current?.play(45, 60);
    else heartRef.current?.play(10, 25);
    setLike((prev) => !prev);
  };

  const onPressAction = () => {
    if (isJoined) goToFeedCreation();
    else goToClubJoin();
  };

  return (
    <Container height={height}>
      <SectionLeft>
        {isJoined ? (
          <>
            {/* <IconButton>
              <Iconify icon="ph:star-fill" size={28} color={lightTheme.accentColor} />
            </IconButton>
            <IconButton>
              <Iconify icon="mingcute:chat-1-line" size={28} color={lightTheme.accentColor} />
            </IconButton> */}
          </>
        ) : (
          <>
            {/* <LottieButton activeOpacity={1} onPress={onPressHeart}>
              <Lottie
                ref={heartRef}
                source={require("../../assets/lottie/70547-like.json")}
                autoPlay={false}
                loop={false}
                speed={1.5}
                colorFilters={[
                  { keypath: "Filled", color: lightTheme.accentColor },
                  { keypath: "Empty", color: "#E0E0E0" },
                ]}
                style={{ width: 41, height: 41 }}
              />
            </LottieButton> */}
            <IconButton onPress={openShare}>
              <Iconify icon="icon-park-outline:share" size={26} color={lightTheme.primaryColor} />
            </IconButton>
          </>
        )}
      </SectionLeft>
      <SectionRight>
        <View style={{ marginHorizontal: 18, borderWidth: 0.5, borderColor: "#B8B8B8", height: 16 }} />
        <Button isJoined={isJoined} onPress={onPressAction}>
          <ButtonText>{isJoined ? "피드쓰기" : "가입신청"}</ButtonText>
        </Button>
      </SectionRight>
    </Container>
  );
};

export default FloatingActionButton;
