import { Stack, router } from "expo-router";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// import AppLoading from "expo-app-loading"; // optional, shows splash screen until fonts are loaded
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SessionProvider,
  useSession,
} from "@/components/providers/SessionProvider";
import useTheme from "@/hooks/useTheme";
import { SplashScreenController } from "@/components/splashScreen";
import { useEffect, useState } from "react";
import ThemeProvider from "@/constants/ThemeProvider";

import NetworkBanner from "@/components/ui/NetworkBanner";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLoader() {
  const { isLoading } = useSession();
  const [unlocked, setUnlocked] = useState(false);

  const [fontsLoaded] = useFonts({
    generalSemiBold: require("../assets/fonts/GeneralSans-Semibold.otf"),
    generalReqular: require("../assets/fonts/GeneralSans-Regular.otf"),
    generalMedium: require("../assets/fonts/GeneralSans-Medium.otf"),
  });

  // block UI
  const isAppReady = fontsLoaded && !isLoading;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);
  console.log(unlocked, "unlocked");

  if (!isAppReady || !unlocked) {
    return <SplashScreenController setUnlocked={setUnlocked} />;
  }

  return <RootNavigator />;
}

function RootNavigator() {
  const { session, isLoading } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    console.log("[nav] auth gate", { isLoading, hasSession: !!session });
    if (isLoading) return;

    if (!session) {
      // Ensure we leave protected screens immediately on logout/expiry
      console.log("[nav] redirect -> /sign-in");
      router.replace("/sign-in");
      return;
    }

    // If user is authenticated and currently on auth screens, go to app root
    console.log("[nav] redirect -> /(app)");
    router.replace("/(app)");
  }, [session, isLoading]);

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        <Stack.Screen name="forgetPassword" options={{ headerShown: false }} />
        <Stack.Screen name="resetPassword" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NetworkBanner />
          <RootLoader />
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
