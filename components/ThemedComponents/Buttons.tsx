import { Href, Link, LinkProps, useRouter } from "expo-router";
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
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  href?: Href;
  className?:string,
  variant?: "primary" | "secondary" | "outline" | "ghost" |"red";
}

export const ThemedButton = ({
  children,
  style,
  variant = "primary",
  href,
  className,
  ...props
}: ThemedButtonProps) => {
  const router = useRouter();
  
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#41e8c0] active:brightness-110 px-6 py-3 rounded-md";
      case "secondary":
        return "bg-[#3d5359] active:bg-[#1a2c33] px-6 py-3 rounded-md";
      case "outline":
        return "border-2 border-[#41e8c0] active:bg-[#41e8c0]/10 px-6 py-3 rounded-md";
      case "ghost":
        return "active:bg-[#41e8c0]/10 px-6 py-3 rounded-md";
      case "red":
        return "active:bg-[#ef4444]/10 px-6 py-3 rounded-md";
      default:
        return "bg-[#41e8c0] px-6 py-3 rounded-md";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "text-[#1a2c33]"; // Dark text on bright bg
      case "secondary":
        return "text-white"; // White text on dark bg
      case "outline":
        return "text-[#41e8c0]"; // Accent color text
      case "ghost":
        return "text-[#41e8c0]"; // Accent color text
      case "red":
        return "text-[#ef4444]"; // Accent color text
      default:
        return "text-[#1a2c33]";
    }
  };

  const handlePress = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Pressable
      className={`${getVariantStyles()} focus:outline-[#41e8c0] outline-offset-4 max-w-lg w-full self-center ${className}`}
      style={style}
      onPress={handlePress}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={`text-center text-base font-semibold ${getTextColor()}`}>
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
