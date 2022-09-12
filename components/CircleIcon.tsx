import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const Container = styled.View<{ kerning: number; opacity: number }>`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.kerning}px;
  opacity: ${(props) => props.opacity};
`;

const BadgeIcon = styled.View`
  position: absolute;
  z-index: 2;
  elevation: 3;
  top: 0;
  right: 0%;
  background-color: white;
  border-radius: 10px;
`;

const Backplate = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background-color: white;
  box-shadow: 1px 1px 1px gray;
  elevation: 2;
`;

const IconImage = styled.Image<{ size: number }>`
  width: ${(props) => props.size - 5}px;
  height: ${(props) => props.size - 5}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
`;

const CircleName = styled(CustomText)`
  font-size: 10px;
  margin-top: 7px;
  font-family: "NotoSansKR-Bold";
  line-height: 13px;
`;

interface CircleIconProps {
  size: number;
  uri?: string | null;
  name?: string;
  badge?: "check-circle" | "stars";
  kerning?: number;
  opacity?: number;
}

const CircleIcon: React.FC<CircleIconProps> = ({ size, uri, name, badge, kerning, opacity }) => {
  return (
    <Container kerning={kerning ?? 0} opacity={opacity ?? 1}>
      {badge ? (
        <BadgeIcon>
          <MaterialIcons name={badge} size={18} color="#ff714b" />
        </BadgeIcon>
      ) : (
        <></>
      )}
      <Backplate size={size}>
        <IconImage source={uri ? { uri: uri } : require("../assets/basic.jpg")} size={size} />
      </Backplate>
      {name ? <CircleName>{name}</CircleName> : <></>}
    </Container>
  );
};

export default CircleIcon;
