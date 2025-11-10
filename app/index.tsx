import { ThemedButton, ThemedLink } from "@/components/ThemedComponents/Buttons";
import {
    ThemedMainHeader,
    ThemedSubHeader,
    ThemedText,
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import "@/global.css";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const Page = () => {
  return (
    <SafeAreaView>
      {/* <View className="bg-white p-4"> */}
      <ThemedMainContainer>
        {/* <Text>index</Text> */}
        <ThemedText>Something</ThemedText>
        <ThemedMainHeader>Header</ThemedMainHeader>
        <ThemedSubHeader>SubHeader</ThemedSubHeader>
        <ThemedButton>Button</ThemedButton>
        <ThemedLink href={'/(auth)/login'}>Login</ThemedLink>
      </ThemedMainContainer>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default Page;
