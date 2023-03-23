import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

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
        <div style={{ width: "320px" }}>
          {!session ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={[]}
            />
          ) : (
            <span>Welcome {session.user.email}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
