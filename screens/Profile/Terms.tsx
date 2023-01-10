import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Wrap = styled.View`
  padding: 20px;
`;

const Headline = styled(CustomText)`
  margin: 20px 0 0;
  line-height: 40px;
  font-family: "NotoSansKR-Bold";
  font-size: 28px;
`;

const Title = styled(CustomText)`
  margin: 20px 0;
  line-height: 30px;
  font-family: "NotoSansKR-Bold";
  font-size: 22px;
`;

const SubTitle = styled(CustomText)`
  margin: 0 0 10px;
  line-height: 24px;
  font-family: "NotoSansKR-Medium";
  font-size: 18px;
`;

const Contents = styled.View`
  margin: 0 0 10px;
`;

const SubContents = styled.View`
  padding-left: 10px;
`;

const Paragraph = styled(CustomText)`
  margin-bottom: 3px;
  line-height: 22px;
  font-family: "NotoSansKR-Regular";
  font-size: 14px;
`;

const Terms = () => {
  return (
    <Container>
      <ScrollView>
        <Wrap>
          <Headline>서비스 이용약관</Headline>

          <Title>제 1장 총칙</Title>

          <SubTitle>제 1조 목적</SubTitle>

          <Contents>
            <Paragraph>이 약관은 온유모임 (이하 “회사”)에서 제공하는 서비스 이용과 관련하여 회사와 이용자와의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</Paragraph>
          </Contents>

          <SubTitle>제 2조 용어의 정의</SubTitle>

          <Contents>
            <Paragraph>1. 서비스: 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 회사 및 회사 관련 제반 서비스를 의미합니다.</Paragraph>
            <Paragraph>2. 이용자: 회사의 웹사이트에 접속하여 본 약관에 따라 회사가 제공하는 콘텐츠 및 제반 서비스를 이용하는 회원 및 비회원을 말합니다.</Paragraph>
            <Paragraph>3. 비밀번호: 회원의 개인 정보 및 확인을 위해서 회원이 정한 문자 또는 숫자의 조합을 의미합니다.</Paragraph>
          </Contents>

          <SubTitle>제 3조 회사의 의무</SubTitle>

          <Contents>
            <Paragraph>
              1. 회사는 계속적이고 안정적인 서비스의 제공을 위하여 지속적으로 노력하며, 회원에게 서비스를 제공할 수 없는 장애가 생긴 경우 지체 없이 이를 복구하여야 합니다. 다만, 천재지변, 비상사태
              또는 그 밖에 부득이한 경우나 회사의 사정상 서비스 제공이 곤란한 경우에는 그 서비스를 일시 중단하거나 중지할 수 있습니다.
            </Paragraph>
            <Paragraph>2. 회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 이용자와의 계약 관련 절차 및 내용 등에 있어 이용자에게 편의를 제공하도록 노력합니다.</Paragraph>
          </Contents>

          <Title>제 2장 회원</Title>

          <SubTitle>제 7조 개인정보보호</SubTitle>

          <Contents>
            <Paragraph>
              회사는 정보통신망이용촉진 및 정보보호에관한 법률 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호를 위해 노력합니다. 개인정보의 보호 및 활용에 대해서는 관련법 및 회사의
              개인정보처리방침이 적용됩니다. 다만, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지 않습니다. 또한, 회사는 회원의 귀책사유로 인해 노출된 정보에 대해서
              책임을 지지 않습니다.
            </Paragraph>
          </Contents>

          <SubTitle>제 8조 회원가입</SubTitle>

          <Contents>
            <Paragraph>1. 회원으로 회사 서비스의 이용을 희망하는 자는 약관의 내용에 동의함을 표시하고, 회사가 제시하는 회원가입 양식에 관련 사항을 기재하여 회원가입을 신청하여야 합니다.</Paragraph>
            <Paragraph>2. 허위 정보를 기재한 회원은 법적인 보호를 받을 수 없으며, 본 약관의 관련 규정에 따라 서비스 사용에 제한을 받을 수 있습니다.</Paragraph>
          </Contents>

          <SubTitle>제 9조 회원 탈퇴 및 자격 상실 등</SubTitle>

          <Contents>
            <Paragraph>1. 회사는 회원이 다음 각 호에 해당하는 경우 별도의 통보 절차 없이 서비스 이용을 제한하거나 회원 자격을 상실시킬 수 있습니다.</Paragraph>
            <SubContents>
              <Paragraph>a. 회원 가입 신청서에 기재 사항을 허위로 작성한 허위로 또는 오기로 정보를 기재하거나 타인의 명의 또는 개인 정보를 도용한 것이 확인된 경우</Paragraph>
              <Paragraph>b. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</Paragraph>
              <Paragraph>c. 부정한 용도로 서비스를 사용하고자 하는 경우</Paragraph>
            </SubContents>
          </Contents>

          <SubTitle>제 10조 이용자의 의무</SubTitle>

          <Contents>
            <Paragraph>1. 비밀번호는 본인이 직접 사용하여야 하며 제3자에게 이용하게 해서는 안 됩니다.</Paragraph>
            <Paragraph>
              2. 회원은 다음 행위를 하여서는 안 되며, 적발 시 회원탈퇴의 조치를 받을 수 있습니다. 또한, 경우에 따라 경고, 일시 정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한하는 조치를 받을
              수 있고, 관련 법규에 의거하여 법적 조치가 이루어질 수 있습니다.
            </Paragraph>
            <SubContents>
              <Paragraph>a. 회원 등록 또는 회원정보 변경 시 허위 또는 타인의 정보를 무단으로 기재 </Paragraph>
              <Paragraph>b. 회사가 금지한 정보(컴퓨터 프로그램 등)의 사용, 송신 또는 게시 </Paragraph>
              <Paragraph>c. 불특정 다수를 대상으로 회사의 서비스를 이용하여 영리활동을 하는 행위 </Paragraph>
              <Paragraph>d. 회사와 제3자의 저작권을 침해하고 명예를 손상시키거나 업무를 방해하는 행위 </Paragraph>
              <Paragraph>e. 외설, 폭력적 표현, 기타 미풍양속에 반하는 정보를 회사에 공개 또는 게시하는 행위 </Paragraph>
              <Paragraph>f. 사실관계를 왜곡하는 정보제공 행위 등 기타 회사가 부적절하다고 판단하는 행위 </Paragraph>
              <Paragraph>g. 타인의 정보 도용</Paragraph>
              <Paragraph>h. 고객센터 문의 및 전화 상담 내용이 욕설, 폭언, 성희롱, 반복민원을 통한 업무방해 등에 해당하는 행위</Paragraph>
            </SubContents>
          </Contents>

          <Title>제 3장 서비스</Title>

          <SubTitle>제 11조 서비스의 제공 및 중단</SubTitle>

          <Contents>
            <Paragraph>
              1. 회사는 유지∙보수를 위한 정기 또는 임시 점검 또는 다른 상당한 이유로 서비스의 제공이 일시 중단될 수 있으며 서비스가 변경 및 중단될 경우 서비스에 대해서는 회원에게 별도로 보상하지
              않습니다.
            </Paragraph>
          </Contents>

          <Title>제 4장 기타</Title>

          <SubTitle>부칙</SubTitle>

          <Contents>
            <Paragraph>1. 본 약관은 2023년 1월 1일부터 적용됩니다.</Paragraph>
          </Contents>
        </Wrap>
      </ScrollView>
    </Container>
  );
};

export default Terms;
