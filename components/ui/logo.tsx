import { useThemeContext } from "@/lib/theme-provider";
import React from "react";
import { Image } from "react-native";

interface LogoProps {
  width: number;
  height?: number;
  style?: any;
}

const Logo = React.forwardRef<any, LogoProps>(
  ({ width, height, style }, ref) => {
    const { colorScheme } = useThemeContext();
    const isDarkMode = colorScheme === "dark";
   const picture = isDarkMode ? require("@/assets/images/icon-dark.png") : require("@/assets/images/icon.png");

    return (
      <Image
        ref={ref}
        
        source= {picture}
        
        style={{
          width: width,
          height: height || width,
          ...style,
        }}
        resizeMode="contain"
      />
    );
  }
);

Logo.displayName = "Logo";
export default Logo;
