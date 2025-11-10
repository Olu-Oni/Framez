import { ReactNode } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
} from "react-native";

interface ThemedTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}

// Factory function to create themed text components
const createThemedText = (baseClassName: string) => {
  return ({ children, style, className = "", ...props }: ThemedTextProps) => (
    <Text className={`${baseClassName} ${className}`} style={style} {...props}>
      {children}
    </Text>
  );
};

// Export themed text variants
export const ThemedText = createThemedText("text-slate-500 dark:text-white");
export const ThemedMainHeading = createThemedText(
  "text-[#41e8c0] font-bold text-5xl"
);
export const ThemedSubHeading = createThemedText(
  "text-[#0d8166] font-semibold dark:text-white text-3xl"
);
export const ThemedSubHeading2 = createThemedText(
  "text-[#0d8166] font-semibold dark:text-white text-3xl"
);


// input
interface ThemedTextInputProps extends TextInputProps {
  // children: ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}

export const ThemedTextInput = ({
  style,
  className,
  ...props
}: ThemedTextInputProps) => {
  return (
    <TextInput
      className={`px-4 py-3 border rounded-md  text-slate-500 dark:text-white border-slate-500 ${className}`}
      style={style}
      placeholderTextColor="white"
      autoCapitalize="none"
    />
  );
};

