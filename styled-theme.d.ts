import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    primaryColor: string;
    primaryBgColor: string;

    secondaryColor: string;

    accentColor: string;
    accnetBgColor: string;

    tertiaryColor: string;
    tertiaryBgColor: string;

    infoColor: string;
    errorColor: string;

    koreanFontB: string;
    koreanFontEB: string;
    koreanFontL: string;
    koreanFontM: string;
    koreanFontR: string;
    koreanFontSB: string;

    koreanSecondaryFontB: string;
    koreanSecondaryFontM: string;
    koreanSecondaryFontR: string;

    englishFontB: string;
    englishFontL: string;
    englishFontM: string;
    englishFontR: string;

    englishSecondaryFontB: string;
    englishSecondaryFontDB: string;
    englishSecondaryFontL: string;
    englishSecondaryFontM: string;
    englishSecondaryFontR: string;
  }
}
