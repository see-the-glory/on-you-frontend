import React, { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Feather, AntDesign, FontAwesome5, Entypo } from "@expo/vector-icons";
import { ClubManagementMainProps, RootStackParamList } from "../../types/Club";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { Shadow } from "react-native-shadow-2";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MainView = styled.ScrollView``;

const Header = styled.View`
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 25px 0px 20px 0px;
`;

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
  padding-left: 10px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 10px;
  background-color: green;
`;

const InformationView = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

const Title = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 18px;
  line-height: 28px;
`;

const HeaderText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 12px;
  color: #b7b7b7;
  padding-left: 5px;
  padding-right: 5px;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 3px;
`;

const Tag = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 0px 3px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;

const TagText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 10px;
  line-height: 14px;
`;

const ButtonView = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
`;

const ToggleButton = styled.TouchableOpacity<{ isToggle: boolean }>`
  width: 35px;
  height: 20px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0px 2px;
  border-radius: 25px;
  background-color: ${(props) => (props.isToggle ? "#295AF5" : "#a5a5a5")};
`;
const Dot = styled.View`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 10px;
  background-color: white;
`;

const Content = styled.View``;
const ListView = styled.View`
  border-bottom-color: #dbdbdb;
  border-bottom-width: 1px;
`;
const ListItem = styled.TouchableOpacity`
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ItemRight = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ItemText = styled(CustomText)`
  margin-left: 10px;
  font-size: 14px;
`;

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface ClubEditItem {
  icon: React.ReactNode;
  title: string;
  screen: keyof RootStackParamList;
}

const ClubManagementMain: React.FC<ClubManagementMainProps> = ({
  navigation: { navigate, goBack },
  route: {
    params: { clubData },
  },
}) => {
  const [items, setItems] = useState<ClubEditItem[]>();
  const [isToggle, setIsToggle] = useState(false);
  const X = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (clubData.recruitStatus === "RECRUIT") {
      setIsToggle(true);
      X.setValue(13);
    }
    const iconSize = 14;
    setItems([
      {
        icon: <Feather name="tool" size={iconSize} color="black" />,
        title: "모임 기본 사항 수정",
        screen: "ClubEditBasics",
      },
      {
        icon: <Feather name="edit-3" size={iconSize} color="black" />,
        title: "소개글 수정",
        screen: "ClubEditIntroduction",
      },
      {
        icon: <Feather name="users" size={iconSize} color="black" />,
        title: "관리자 / 멤버 관리",
        screen: "ClubEditMembers",
      },
      {
        icon: <Feather name="x-circle" size={iconSize} color="red" />,
        title: "모임 삭제",
        screen: "ClubDelete",
      },
    ]);
  }, []);

  const goToScreen = (screen: keyof RootStackParamList) => {
    return navigate(screen, { clubData });
  };

  const onPressToggle = () => {
    if (isToggle) {
      Animated.timing(X, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(X, {
        toValue: 13,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    setIsToggle((prev) => !prev);
  };
  return (
    <Container>
      <StatusBar barStyle={"default"} />
      <MainView>
        <Shadow distance={3} viewStyle={{ width: "100%" }}>
          <Header>
            <NavigationView height={100}>
              <LeftNavigationView>
                <TouchableOpacity onPress={goBack}>
                  <Entypo name="chevron-thin-left" size={24} color="black" />
                </TouchableOpacity>
              </LeftNavigationView>
              <RightNavigationView></RightNavigationView>
            </NavigationView>

            <InformationView>
              <TagView>
                <Tag color={"white"}>
                  <FontAwesome5 name="cross" size={6} color="#A5A5A5" />
                  <TagText style={{ color: "#A5A5A5", marginLeft: 3 }}>{clubData.organizationName}</TagText>
                </Tag>
                {clubData.categories[0] ? (
                  <Tag color={"#B4B4B4"}>
                    <TagText style={{ color: "white" }}>{clubData.categories[0].name}</TagText>
                  </Tag>
                ) : (
                  <></>
                )}
                {clubData.categories[1] ? (
                  <Tag color={"#B4B4B4"}>
                    <TagText style={{ color: "white" }}>{clubData.categories[1].name}</TagText>
                  </Tag>
                ) : (
                  <></>
                )}
              </TagView>
              <Title>{clubData.name}</Title>
            </InformationView>
            <CircleIcon size={70} uri={clubData.thumbnail} />
            <ButtonView>
              <AntDesign name="user" size={10} color="#B7B7B7" />
              <HeaderText>멤버모집</HeaderText>
              <ToggleButton onPress={onPressToggle} isToggle={isToggle} activeOpacity={1}>
                <AnimatedDot style={{ transform: [{ translateX: X }] }} />
                <AntDesign name="adduser" size={10} color="#FFFFFF" />
                <AntDesign name="deleteuser" size={10} color="#FFFFFF" />
              </ToggleButton>
            </ButtonView>
          </Header>
        </Shadow>
        <Content>
          {items?.map((item, index) => (
            <ListView key={index}>
              <ListItem
                onPress={() => {
                  goToScreen(item.screen);
                }}
              >
                <ItemLeft>
                  {item.icon}
                  <ItemText style={index === items.length - 1 ? { color: "red" } : {}}>{item.title}</ItemText>
                </ItemLeft>
                <ItemRight>
                  <Feather name="chevron-right" size={20} color="#A0A0A0" />
                </ItemRight>
              </ListItem>
            </ListView>
          ))}
        </Content>
      </MainView>
    </Container>
  );
};

export default ClubManagementMain;
