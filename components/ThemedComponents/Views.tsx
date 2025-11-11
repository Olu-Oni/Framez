import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

interface ThemedViewProps extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedCard = ({ children, style, ...props }: ThemedViewProps) => {
  return (
    <View className="p-4 bg-white dark:bg-black" style={style} {...props}>
      {children}
    </View>
  );
};
export const ThemedMainContainer = ({ children, style, ...props }: ThemedViewProps) => {
  return (
    <View className="justify-center h-full gap-4 p-2 bg-white dark:bg-black" style={[style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer:{
  }

})