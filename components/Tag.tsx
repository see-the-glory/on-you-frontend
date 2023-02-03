import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const TagView = styled.View<{ backgroundColor: string; borderColor: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => (props.backgroundColor ? props.backgroundColor : "white")};
  padding: 2px 6px;
  border-radius: 5px;
  margin-right: 5px;
  ${(props: any) => (props.borderColor ? `border: 1px solid ${props.borderColor};` : "")}
`;

const TagText = styled.Text<{ color: string }>`
  font-size: 11px;
  line-height: 14px;
  color: ${(props: any) => (props.color ? props.color : "white")};
`;

interface TagProps {
  name: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const Tag: React.FC<TagProps> = ({ name, textColor, backgroundColor, borderColor }) => {
  return (
    <TagView backgroundColor={backgroundColor} borderColor={borderColor}>
      <TagText color={textColor}>{name}</TagText>
    </TagView>
  );
};
export default Tag;
