import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import { Club, Notification } from "../api";
import moment from "moment";

const Item = styled.View``;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ItemTitle = styled(CustomText)`
  color: #8e8e8e;
`;
const ItemDateText = styled(CustomText)`
  font-size: 11px;
  line-height: 15px;
  color: #9a9a9a;
`;
const TextView = styled.View`
  flex-direction: row;
`;
const ItemText = styled(CustomText)<{ processDone: boolean }>`
  font-size: 15px;
  line-height: 22px;
  ${(props: any) => (props.processDone ? "color: #8E8E8E" : "")};
`;
const ItemBoldText = styled(ItemText)`
  font-family: "NotoSansKR-Bold";
`;

interface NotificationItemProps {
  notificationData: Notification;
  clubData: Club;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notificationData, clubData }) => {
  if (notificationData?.actionType === "APPLY") {
    return (
      <Item>
        <Header>
          <ItemTitle>가입희망</ItemTitle>
          <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
        </Header>
        <TextView>
          <ItemBoldText processDone={notificationData?.processDone}>{notificationData?.actionerName}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{`님이 `}</ItemText>
          <ItemBoldText processDone={notificationData?.processDone}>{clubData?.name}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{` 가입을 희망합니다.`}</ItemText>
        </TextView>
      </Item>
    );
  } else if (notificationData?.actionType === "APPROVE") {
    return (
      <Item>
        <Header>
          <ItemTitle>가입수락</ItemTitle>
          <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
        </Header>
        <TextView>
          <ItemBoldText processDone={notificationData?.processDone}>{notificationData?.actionClubName}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{` 모임에 가입되셨습니다!`}</ItemText>
        </TextView>
      </Item>
    );
  } else if (notificationData?.actionType === "REJECT") {
    return (
      <Item>
        <Header>
          <ItemTitle>가입거절</ItemTitle>
          <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
        </Header>
        <TextView>
          <ItemBoldText processDone={notificationData?.processDone}>{notificationData?.actionClubName}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{` 모임에서 메시지가 도착했습니다.`}</ItemText>
        </TextView>
      </Item>
    );
  } else {
    return <></>;
  }
};

export default NotificationItem;
