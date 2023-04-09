import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    let ts = setTimeout(() => setDisplay(""));

    return () => clearTimeout(ts);
  }, []);

  if (session) {
    router.push("/dashboard/jobs");
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ width: "320px", display }}>
          {!session ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={[]}
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <span>Welcome {session.user.email}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
