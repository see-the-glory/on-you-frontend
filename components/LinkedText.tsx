import React from "react";
import { StyleProp, TextProps, TextStyle } from "react-native";
import styled from "styled-components/native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useToast } from "react-native-toast-notifications";
import * as WebBrowser from "expo-web-browser";

const NormalText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #555555;
  font-size: 14px;
`;

const LinkText = styled(NormalText)`
  color: #0969da;
`;

interface LinkedTextProps {
  children?: string;
  linkStyle?: StyleProp<TextStyle>;
}

const LinkedText: React.FC<LinkedTextProps & TextProps> = ({ children, linkStyle, ...props }) => {
  const toast = useToast();
  const linkRegex = /https?:\/\/[^\s]+/g;
  const aboutList = children?.split(linkRegex) ?? "";
  const aboutLinks = children?.match(linkRegex) ?? "";
  const merged = [];
  for (let i = 0; i < aboutList?.length; i++) {
    merged.push({ type: "text", text: aboutList[i] });
    if (i < aboutLinks?.length) merged.push({ type: "link", text: aboutLinks[i] });
  }

  const browseLink = async (link: string) => {
    await WebBrowser.openBrowserAsync(link);
  };

  const copyLink = (link: string) => {
    Clipboard.setString(link);
    toast.show(`링크를 복사했습니다.`, { type: "success" });
  };

  return (
    <NormalText {...props}>
      {merged?.map((data, index) =>
        data.type === "text" ? (
          data.text
        ) : (
          <LinkText key={`Link_${index}`} onPress={() => browseLink(data.text)} onLongPress={() => copyLink(data.text)} style={linkStyle}>
            {data.text}
          </LinkText>
        )
      )}
    </NormalText>
  );
};

export default LinkedText;
