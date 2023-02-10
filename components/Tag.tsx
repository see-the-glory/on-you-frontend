import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const TagView = styled.View<{ backgroundColor: string; borderColor: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => (props.backgroundColor ? props.backgroundColor : "white")};
  padding: 2px 4px;
  border-radius: 5px;
  margin-right: 5px;
  ${(props: any) => (props.borderColor ? `border: 1px solid ${props.borderColor};` : "")}
`;

const TagText = styled(CustomText)<{ color: string }>`
  font-family: "NotoSansKR-Medium";
  font-size: 11px;
  line-height: 15px;
  color: ${(props: any) => (props.color ? props.color : "white")};
`;

interface TagProps {
  name: string;
  iconName?: "cross";
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const Tag: React.FC<TagProps> = ({ name, iconName, textColor, backgroundColor, borderColor }) => {
  return (
    <TagView backgroundColor={backgroundColor} borderColor={borderColor}>
      {iconName ? <FontAwesome5 name={iconName} size={8} color={textColor} style={{ marginRight: 2 }} /> : <></>}
      <TagText color={textColor}>{name}</TagText>
    </TagView>
  );
};
export default Tag;
