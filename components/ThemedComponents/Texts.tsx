import { ReactNode } from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

interface ThemedTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}

// Factory function to create themed text components
const createThemedText = (baseClassName: string) => {
  return ({ children, style, className = "", ...props }: ThemedTextProps) => (
    <Text 
      className={`${baseClassName} ${className}`} 
      style={style} 
      {...props}
    >
      {children}
    </Text>
  );
};

// Export themed text variants
export const ThemedText = createThemedText("text-slate-500 dark:text-white");
export const ThemedMainHeader = createThemedText("text-[#41e8c0] font-bold text-5xl");
export const ThemedSubHeader = createThemedText("text-[#0d8166] font-semibold dark:text-white text-3xl");