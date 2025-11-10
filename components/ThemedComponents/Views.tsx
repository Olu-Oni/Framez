import { ReactNode } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

interface ThemedViewProps extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedCard = ({ children, style, ...props }: ThemedViewProps) => {
  return (
    <View className="bg-white dark:bg-black" style={style} {...props}>
      {children}
    </View>
  );
};
export const ThemedMainContainer = ({ children, style, ...props }: ThemedViewProps) => {
  return (
    <View className="bg-slate-200 dark:bg-black gap-4 justify-center p-2" style={style} {...props}>
      {children}
    </View>
  );
};