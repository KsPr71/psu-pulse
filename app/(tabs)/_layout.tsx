import { DeveloperDrawer } from "@/components/developer-drawer";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Logo from "@/components/ui/logo";
import { useColors } from "@/hooks/use-colors";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: true,

          tabBarButton: HapticTab,
          headerLeft: () => <Logo width={24} height={24} style={{ marginLeft: 16, marginRight: 8 }} />,
          headerRight: () => (
            <Pressable
              onPress={() => setDrawerOpen(true)}
              style={{
                marginRight: 16,
                padding: 8,
              }}
            >
              <IconSymbol
                size={24}
                name="line.3.horizontal"
                color={colors.primary}
              />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: 0.5,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
          },
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Calculadora",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="bolt.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="resumen"
          options={{
            title: "Resumen",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: "Info",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="info.circle.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      <DeveloperDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </View>
  );
}
