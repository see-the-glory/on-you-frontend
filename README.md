# on-you-frontend

## **Common**

Reference Documentation
+ https://reactnative.dev/docs/environment-setup
+ https://dev-yakuza.posstree.com/assets/images/category/react-native/2018/install-on-windows/android_studio_configure_environment_variable_add_new_ko.jpg

<br>

Node (node -v)
```
node -v
v16.13.2 (LTS)
```
<br>

JDK (javac --version)
```
javac --version
javac 11.0.11
```
<br>

Xcode (xcodebuild -showsdks)
```
Xcode 13.2.1
iOS SDKs: iOS 15.2
iOS Simulator SDKs: Simulator - iOS 15.2
```
<br>

---

<br>

## **Mac**
<br>

1. Node & Watchman

```
brew install node
brew install watchman
```
<br>

2. Java Development Kit

```
brew install --cask adoptopenjdk/openjdk/adoptopenjdk11
```
<br>

3. Android development environment

    + Android Studio -> Settings -> Appearance & Behavior -> System Settings -> Android SDK
        + Android SDK Platform 30
        + Sources for Android 30
        + Intel x86 Atom_64 System Image
        + Google APIs Intel x86 Atom_64 System Image
        + Google Play Intel x86 Atom_64 System Image

<br>


4. Configure the ANDROID_HOME environment variable
    + Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc (if you are using zsh then ~/.zprofile or ~/.zshrc) config file
```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

5. Xcode Command Line Tools
![alt Xcode Command Line Tools](https://reactnative.dev/assets/images/GettingStartedXcodeCommandLineTools-8259be8d3ab8575bec2b71988163c850.png)


6. CocoaPods
```
sudo gem install cocoapods
```

---
<br>

## **Windows**

<br>

1. Install Chocolatey and JDK
    + [Chocolatey](http://chocolatey.org)

```
choco install -y nodejs-lts openjdk11
```
<br>

2. Android development environment

    + Android Studio -> Settings -> Appearance & Behavior -> System Settings -> Android SDK
        + Android SDK Platform 30
        + Sources for Android 30
        + Intel x86 Atom_64 System Image
        + Google APIs Intel x86 Atom_64 System Image
        + Google Play Intel x86 Atom_64 System Image

<br>

3. Configure the ANDROID_HOME environment variable

    + Open the Windows Control Panel.
    + Click on User Accounts, then click User Accounts again
    + Click on Change my environment variables
    + Click on New... to create a new ANDROID_HOME user variable that points to the path to your Android SDK

![alt ANDROID_HOME](https://dev-yakuza.posstree.com/assets/images/category/react-native/2018/install-on-windows/android_studio_configure_environment_variable_add_new_ko.jpg)

<br>

4. Add platform-tools to Path

    + Open the Windows Control Panel.
    + Click on User Accounts, then click User Accounts again
    + Click on Change my environment variables
    + Select the Path variable.
    + Click Edit.
    + Click New and add the path to platform-tools to the list.

![alt PLATFORM-TOOLS](https://dev-yakuza.posstree.com/assets/images/category/react-native/2018/install-on-windows/android_studio_configure_environment_variable_edit_path_ko.jpg)

<br>

---

<br>

## **Execution**

```
npm install
```

<br>

```
npm run ios
npm run android
```


<br>

## **Error**

<br>

```
error Failed to install the app. Make sure you have an Android emulator running or a device connected.
```
- Android Studio 에 Simulator 생성할 것


```
settings.gradle complie
```
- 충돌되는 JDK 가 있으면 삭제할 것
