import React from "react";
import styled from "styled-components/native";
import { Club, Notification } from "api";
import moment from "moment";

const Item = styled.View``;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ItemTitle = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 12px;
  color: #8e8e8e;
  margin-bottom: 3px;
`;
const ItemDateText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 11px;
  line-height: 15px;
  color: #9a9a9a;
`;
const TextView = styled.View`
  flex-direction: row;
`;
const ItemText = styled.Text<{ read: boolean }>`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 15px;
  line-height: 22px;
  color: ${(props) => (props.read ? "#8E8E8E" : "black")};
`;
const ItemBoldText = styled(ItemText)`
  font-family: ${(props) => props.theme.koreanFontB};
`;

interface NotificationItemProps {
  notificationData: Notification;
  notificationType: string;
  clubData: Club;
}

interface ActionType {
  title: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notificationData, notificationType, clubData }) => {
  switch (notificationData?.actionType) {
    case "APPLY":
      return (
        <Item>
          <Header>
            <ItemTitle>가입희망</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.done || notificationData?.processDone}>{notificationData?.actionerName}</ItemBoldText>
            <ItemText read={notificationData?.done || notificationData?.processDone}>{`님이 `}</ItemText>
            <ItemBoldText read={notificationData?.done || notificationData?.processDone}>{clubData?.name}</ItemBoldText>
            <ItemText read={notificationData?.done || notificationData?.processDone}>{` 가입을 희망합니다.`}</ItemText>
          </TextView>
        </Item>
      );
    case "APPROVE":
      return (
        <Item>
          <Header>
            <ItemTitle>가입수락</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.read}>{notificationData?.actionClubName}</ItemBoldText>
            <ItemText read={notificationData?.read}>{` 모임에 가입되셨습니다!`}</ItemText>
          </TextView>
        </Item>
      );
    case "REJECT":
      return (
        <Item>
          <Header>
            <ItemTitle>가입거절</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.read}>{notificationData?.actionClubName}</ItemBoldText>
            <ItemText read={notificationData?.read}>{` 모임에서 메시지가 도착했습니다.`}</ItemText>
          </TextView>
        </Item>
      );
    case "FEED_CREATE":
      return (
        <Item>
          <Header>
            <ItemTitle>모임소식</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.read}>{notificationData?.actionerName}</ItemBoldText>
            <ItemText read={notificationData?.read}>{`님이 게시물을 올렸습니다.`}</ItemText>
          </TextView>
        </Item>
      );
    case "FEED_COMMENT":
      return (
        <Item>
          <Header>
            <ItemTitle>댓글알림</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.read}>{notificationData?.actionerName}</ItemBoldText>
            <ItemText read={notificationData?.read}>{`님이 내 글에 댓글을 달았습니다.`}</ItemText>
          </TextView>
        </Item>
      );
    case "SCHEDULE_CREATE":
      if (notificationType === "CLUB") {
        return (
          <Item>
            <Header>
              <ItemTitle>일정알림</ItemTitle>
              <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
            </Header>
            <TextView>
              <ItemBoldText read={notificationData?.read}>{notificationData?.actionerName}</ItemBoldText>
              <ItemText read={notificationData?.read}>{`님이 새로운 일정을 등록했습니다.`}</ItemText>
            </TextView>
          </Item>
        );
      } else if (notificationType === "USER") {
        return (
          <Item>
            <Header>
              <ItemTitle>일정알림</ItemTitle>
              <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
            </Header>
            <TextView>
              <ItemBoldText read={notificationData?.read}>{notificationData?.actionClubName}</ItemBoldText>
              <ItemText read={notificationData?.read}>{`에 새로운 일정이 등록되었습니다.`}</ItemText>
            </TextView>
          </Item>
        );
      }
    case "COMMENT_REPLY":
      return (
        <Item>
          <Header>
            <ItemTitle>답글알림</ItemTitle>
            <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
          </Header>
          <TextView>
            <ItemBoldText read={notificationData?.read}>{notificationData?.actionerName}</ItemBoldText>
            <ItemText read={notificationData?.read}>{`님이 내 글에 답글을 달았습니다.`}</ItemText>
          </TextView>
        </Item>
      );
    default:
      return <></>;
  }
};

export default NotificationItem;
