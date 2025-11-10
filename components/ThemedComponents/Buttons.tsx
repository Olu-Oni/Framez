import { Href, Link, LinkProps } from "expo-router";
import { ReactNode } from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    Text,
    ViewStyle,
} from "react-native";

// Button Component
interface ThemedButtonProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const ThemedButton = ({
  children,
  style,
  variant = "primary",
  ...props
}: ThemedButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#41e8c0] hover:brightness-110 hover:shadow-white hover:shadow-hard-4 px-6 py-3 rounded-md";
      case "secondary":
        return "bg-[#3d5359] active:bg-[#1a2c33] px-6 py-3 rounded-md";
      case "outline":
        return "border-2 border-[#41e8c0] active:bg-[#41e8c0]/10 px-6 py-3 rounded-md";
      case "ghost":
        return "active:bg-[#41e8c0]/10 px-6 py-3 rounded-md";
      default:
        return "bg-[#41e8c0] px-6 py-3 rounded-md";
    }
  };

  return (
    <Pressable
      className={`${getVariantStyles()} active:outline outline-offset-2`}
      style={style}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={`text-center text-base  font-semibold ${variant === "primary" ? "text-[#1a2c33]" : "text-white"}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
// Link Component
interface ThemedLinkProps extends LinkProps{
  children: ReactNode;
  href: Href;
}

export const ThemedLink = ({
  children,
  style,
  href,
  ...props
}: ThemedLinkProps) => {
  return (
    <Link
      href={href}
      style={style}
      {...props}
      className="active:opacity-70 text-[#41e8c0] underline font-medium"
    >
      {children}
    </Link>
  );
};
