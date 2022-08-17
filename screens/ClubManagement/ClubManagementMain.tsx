import React, { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, Text, View } from "react-native";
import styled from "styled-components/native";
import { Feather, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { ClubmanagementMainProps, RootStackParamList } from "../../Types/Club";
import CircleIcon from "../../components/CircleIcon";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MainView = styled.ScrollView``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 20px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;
const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const InformationView = styled.View`
  margin-left: 15px;
`;

const Title = styled.Text`
  font-size: 21px;
  font-weight: 800;
`;

const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  padding-left: 5px;
  padding-right: 5px;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
`;

const Tag = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 3px 5px 3px 5px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ToggleButton = styled.TouchableOpacity<{ isToggle: boolean }>`
  width: 45px;
  height: 25px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 3px;
  border-radius: 25px;
  background-color: ${(props) => (props.isToggle ? "#295AF5" : "#a5a5a5")};
`;
const Dot = styled.View`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: white;
`;

const Content = styled.View``;
const ListView = styled.View`
  border-bottom-color: #dbdbdb;
  border-bottom-width: 1px;
`;
const ListItem = styled.TouchableOpacity`
  padding: 20px;
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
const ItemText = styled.Text`
  margin-left: 10px;
  font-size: 18px;
`;

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface ClubEditItem {
  icon: React.ReactNode;
  title: string;
  screen: keyof RootStackParamList;
}

const ClubManagementMain: React.FC<ClubmanagementMainProps> = ({
  navigation: { navigate },
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
      X.setValue(18);
    }
    const iconSize = 16;
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
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(X, {
        toValue: 18,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    setIsToggle((prev) => !prev);
  };
  return (
    <Container>
      <StatusBar barStyle={"default"} />
      <MainView>
        <Header>
          <HeaderLeft>
            <CircleIcon size={70} uri={clubData.thumbnail} />
            <InformationView>
              <TagView>
                <Tag color={"white"}>
                  <FontAwesome5 name="cross" size={8} color="#A5A5A5" />
                  <Text style={{ color: "#A5A5A5", marginLeft: 3, fontSize: 11 }}>{clubData.organizationName}</Text>
                </Tag>
                {clubData.categories[0] ? (
                  <Tag color={"#B4B4B4"}>
                    <Text style={{ color: "white", fontSize: 11 }}>{clubData.categories[0].name}</Text>
                  </Tag>
                ) : (
                  <></>
                )}
                {clubData.categories[1] ? (
                  <Tag color={"#B4B4B4"}>
                    <Text style={{ color: "white", fontSize: 11 }}>{clubData.categories[1].name}</Text>
                  </Tag>
                ) : (
                  <></>
                )}
              </TagView>
              <Title>{clubData.name}</Title>
            </InformationView>
          </HeaderLeft>
          <HeaderRight>
            <AntDesign name="user" size={12} color="black" />
            <HeaderText>멤버모집</HeaderText>
            <ToggleButton onPress={onPressToggle} isToggle={isToggle} activeOpacity={1}>
              <AnimatedDot style={{ transform: [{ translateX: X }] }} />
              <AntDesign name="adduser" size={12} color="#FFFFFF" />
              <AntDesign name="deleteuser" size={12} color="#FFFFFF" />
            </ToggleButton>
          </HeaderRight>
        </Header>
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
