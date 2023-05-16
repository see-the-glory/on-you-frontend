import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { ClubRole } from "../api";
import Lottie from "lottie-react-native";
import { lightTheme } from "../theme";

const Container = styled.View`
  position: absolute;
  flex-direction: row;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  width: 100%;
  height: 70px;
  bottom: 0px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: ${Platform.OS === "ios" ? 8 : 0}px;
`;

const SectionLeft = styled.View`
  flex-direction: row;
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
  role?: ClubRole | null;
  recruitStatus?: "OPEN" | "CLOSE" | null;
  openShare: () => void;
  goToClubJoin: () => void;
  goToFeedCreation: () => void;
}

const FloatingActionButton: React.FC<ClubHomeFloatingButtonProps> = ({ role, recruitStatus, openShare, goToClubJoin, goToFeedCreation }) => {
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
    <Container>
      <SectionLeft>
        {isJoined ? (
          <>
            <IconButton>
              <MaterialIcons name={"star"} size={28} color={lightTheme.accentColor} />
            </IconButton>
            <IconButton>
              <MaterialIcons name="chat" size={28} color={lightTheme.accentColor} />
            </IconButton>
          </>
        ) : (
          <>
            <LottieButton activeOpacity={1} onPress={onPressHeart}>
              <Lottie
                ref={heartRef}
                source={require("../assets/lottie/70547-like.json")}
                autoPlay={false}
                loop={false}
                speed={1.5}
                colorFilters={[
                  { keypath: "Filled", color: lightTheme.accentColor },
                  { keypath: "Empty", color: "#E0E0E0" },
                ]}
                style={{ width: 38, height: 38 }}
              />
            </LottieButton>
            <IconButton onPress={openShare}>
              <MaterialIcons name="ios-share" size={25} color={lightTheme.primaryColor} />
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
