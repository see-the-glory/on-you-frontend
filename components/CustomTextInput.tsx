import React from "react";
import { StyleSheet, TextInput } from "react-native";
import styled from "styled-components/native";

const CustomTextInput = styled.TextInput`
  font-family: "NotoSansKR-Regular";
  line-height: 19px;
  font-size: 12px;
`;

export default CustomTextInput;

// export default class CustomTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <TextInput style={[styles.defaultStyle, this.props.style]} {...this.props} allowFontScaling={false}>
//         {this.props.children}
//       </TextInput>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   // ... add your default style here
//   defaultStyle: {
//     fontFamily: "NotoSansKR-Regular",
//     lineHeight: 19,
//     fontSize: 12,
//   },
// });
