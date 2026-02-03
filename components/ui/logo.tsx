import { Image } from "react-native";
import React from "react";

interface LogoProps {
  width: number;
  height?: number;
  style?: any;
}

const Logo = React.forwardRef<any, LogoProps>(
  ({ width, height, style }, ref) => {
    return (
      <Image
        ref={ref}
        source={require("@/assets/images/icon.png")}
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
