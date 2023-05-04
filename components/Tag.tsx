import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import styled from "styled-components/native";

const TagView = styled.View<{ backgroundColor: string; borderColor: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => (props.backgroundColor ? props.backgroundColor : "white")};
  padding: 2px 4px;
  border-radius: 5px;
  margin-right: 5px;
  ${(props: any) => (props.borderColor ? `border: 1px solid ${props.borderColor};` : "")}
`;

const TagText = styled.Text<{ color: string; includeEmoji: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 11px;
  line-height: ${(props: any) => (props.includeEmoji ? 15 : 13)}px;
  color: ${(props: any) => (props.color ? props.color : "white")};
`;

interface TagProps {
  name: string;
  iconName?: "cross";
  iconSize?: number;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
}

const Tag: React.FC<TagProps> = ({ name, iconName, textColor, backgroundColor, borderColor, contentContainerStyle, textStyle, iconSize }) => {
  const includeEmoji = /\p{Extended_Pictographic}/u.test(name);
  return (
    <TagView backgroundColor={backgroundColor} borderColor={borderColor} style={contentContainerStyle}>
      {iconName ? <FontAwesome5 name={iconName} size={iconSize ?? 8} color={textColor} style={{ marginRight: 1 }} /> : <></>}
      <TagText color={textColor} includeEmoji={includeEmoji} style={textStyle}>
        {name}
      </TagText>
    </TagView>
  );
};
export default Tag;
