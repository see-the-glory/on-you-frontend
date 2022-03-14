import React, {useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView} from 'react-native';
import {StatusBar} from "expo-status-bar";
import styled from 'styled-components/native';
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

const ClubMakingAPI=axios.create({
    baseURL: 'http://localhost:8080/feeds/new',
    timeout: 1000
})

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: black;
  position: relative;
  flex-direction: column;
  width: auto;
`;

const TitleView = styled.View`
    width: 100%;
    height: 80px;
    flex-direction: column;
`

const ClubTitle=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
`
const TitleInput=styled.TextInput`
  width: 100%;
  background-color: white;
  height: 50px;
`

//내용컨테이너
const ContentView=styled.View`
  width: 150px;
  height: 80px;
  flex-direction: column;
`
//내용
const ContentTitle=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
  margin-top: 10px;
`
//내용인풋
const Content=styled.TextInput`
  background-color: white;
  height: 150px;
  margin-top: 10px;
  width: 380px;
`
//해시태그컨테이너
const HasTagContainer=styled.View`
  width: 150px;
  height: 80px;
  flex-direction: column;
  top: 130px;
`

const HashTagTitle=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
  width: 100%;
`
const HashTagInput=styled.TextInput`
  background-color: white;
  height: 50px;
  margin-top: 10px;
  width: 380px;
`
const PublicChoice=styled.View`
  width: 100%;
  height: 80px;
  flex-direction: column;
  top: 150px;
`
const ShowTitle=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
`
const GroupSelect=styled.View`
  width: 100%;
  height: 80px;
  flex-direction: column;
  top: 180px;
`
const ShowGroup=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
`
const AttachImgView=styled.View`
  width: 100%;
  height: 80px;
  align-items: center;
  flex-direction: row;
  top: 180px;
`
const ImgTitle=styled.Text`
  color: white;
  left: 10px;
  font-size: 30px;
`

const ImgPrint=styled.Image`
  width: 350px;
  height: 200px;
  top: 120px;
  left: -100px;
  flex-direction: column;
`

const ConfirmButton=styled.Button`
   position: relative;
`

const NativeStack = createNativeStackNavigator();

const Clubs = () => (
    <Container>
        <StatusBar style="auto"/>
        <ScrollView stickyHeaderInduces={[2]}>
        <TitleView>
            <ClubTitle>제목</ClubTitle>
            <TitleInput placeholder="필수입력 구문입니다."/>
        </TitleView>

        <ContentView>
            <ContentTitle>내용</ContentTitle>
            <Content placeholder="필수입력 구문입니다."/>
        </ContentView>

            <HasTagContainer>
                <HashTagTitle>해시태그</HashTagTitle>
                <HashTagInput placeholder="필수입력 구문입니다."
                />
            </HasTagContainer>

        <PublicChoice>
            <ShowTitle>공개여부</ShowTitle>
            <RNPickerSelect onValueChange={(value)=>console.log(value)}
                            items={[
                                {label: '비공개', value: 'UnPublic'},
                                {label: '그룹에만 공개', value: 'PublicInGroup'},
                            ]}
                            placeholder={{
                                label: '공개',
                                value: 'Public',
                            }}
            />
            <TitleInput/>
        </PublicChoice>

        {/* 피드에서 생성시 그룹에 속해있는 회원일 경우 속한 그룹의 리스트가 나온다. 속한 그룹이 없다면 가입하라고 그룹 리스트를 보여준다.*/}
        <GroupSelect>
            <ShowGroup>표시될 그룹</ShowGroup>
            <RNPickerSelect onValueChange={(value)=>console.log(value)}
                            items={[
                                {label: '공개', value: 'Public'},
                                {label: '비공개', value: 'UnPublic'},
                                {label: '그룹에만 공개', value: 'PublicInGroup'},
                            ]}
                            placeholder={{
                                label: '표시될 그룹을 선택해주세요',
                                value: null,
                            }}
            />
            <TitleInput/>
        </GroupSelect>



        <AttachImgView>
            <ImgTitle>사진첨부</ImgTitle>

        </AttachImgView>


        </ScrollView>
        <ConfirmButton title="등록" onpress={
            axios.post("http://localhost:8080/feeds/new",{
                id:"",
                title:"",
                content:"",
                access:""
            }).then(function(response){
                console.log(data);
            })
        }/>
    </Container>

);


export default Clubs;
