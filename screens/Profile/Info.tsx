import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import * as WebBrowser from "expo-web-browser";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
`;

const MenuItemText = styled(CustomText)`
  color: #2e2e2e;
  font-family: "NotoSansKR-Medium";
  font-size: 16px;
  line-height: 22px;
`;

const TouchMenu = styled.View`
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dbdbdb;
  justify-content: center;
`;

const ChevronBox = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const Info: React.FC<NativeStackScreenProps<any, "Info">> = ({ navigation: { navigate } }) => {
  const openWebView = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };
  return (
    <Container>
      <TouchMenu>
        <MenuItem onPress={() => openWebView("https://thin-helium-f6d.notion.site/cc73961fd43141d5baab97d1003a4cb3")}>
          <MenuItemText>개인정보처리방침</MenuItemText>
          <ChevronBox>
            <Feather name="chevron-right" color="#A0A0A0" size={20} />
          </ChevronBox>
        </MenuItem>
      </TouchMenu>
      <TouchMenu>
        <MenuItem onPress={() => openWebView("https://thin-helium-f6d.notion.site/5b292059b0d04e31925af2fd14e8271b")}>
          <MenuItemText>약관</MenuItemText>
          <ChevronBox>
            <Feather name="chevron-right" color="#A0A0A0" size={20} />
          </ChevronBox>
        </MenuItem>
      </TouchMenu>
    </Container>
  );
};

export default Info;
