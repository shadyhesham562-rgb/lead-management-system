import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import LeadsPage from "./pages/LeadsPage";
import Login from "./pages/Login";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#061530",
          color: "#fff",
        }}
      >
        Loading...
      </div>
    );
  }

  return session ? <LeadsPage /> : <Login />;
}