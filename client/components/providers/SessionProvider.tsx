import { useStorageState } from "@/hooks/useStorageState";
import { useRouter } from "expo-router";
import { use, createContext, type PropsWithChildren, useEffect } from "react";
const AuthContext = createContext<{
  signIn: (token: string, tokenExpiry?: number | null) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("token");
  const [[isLoadingExpiry, tokenExpiry], setTokenExpiry] =
    useStorageState("tokenExpiry");
  const router = useRouter();
  const signOut = () => {
    console.log("[auth] signOut() called");
    setSession(null);
    setTokenExpiry(null);
    router.replace("/sign-in");
  };

  useEffect(() => {
    console.log("[auth] state", {
      isLoading,
      isLoadingExpiry,
      hasSession: !!session,
      tokenExpiry,
      now: Date.now(),
    });
    if (!session) return;
    if (!tokenExpiry) return;

    const expiry = Number(tokenExpiry);
    if (!Number.isFinite(expiry) || expiry <= 0) return;

    const expiresIn = expiry - Date.now();
    console.log("[auth] expiry computed", {
      expiry,
      now: Date.now(),
      expiresIn,
    });

    if (expiresIn <= 0) {
      console.log("[auth] already expired -> signOut now");
      signOut();
      return;
    }

    if (expiresIn > 0) {
      console.log("[auth] scheduling auto logout", { inMs: expiresIn });
      const timeoutId = setTimeout(() => {
        console.log("[auth] auto logout timer fired");
        signOut();
      }, expiresIn);
      return () => {
        console.log("[auth] clearing auto logout timer");
        clearTimeout(timeoutId);
      };
    }
  }, [session, tokenExpiry]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string, expiry?: number | null) => {
          setSession(token);
          if (expiry) setTokenExpiry(String(expiry));
        },
        signOut,
        session,
        isLoading: isLoading || isLoadingExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
