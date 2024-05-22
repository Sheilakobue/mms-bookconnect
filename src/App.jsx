import React, {useState} from 'react'
import Header from "./components/Header";
import Cards from "./components/Cards";
import Carousel from "./components/Carousel";
import "./components/MainPage.css";
import "./components/Carousel.css"
import { supabase } from "./components/SupabaseClient";
import SupabaseClient from "./components/SupabaseClient";


export default function App() {
  const [throwSignUp, setThrowSignUp] = useState("signUpPhase");

  React.useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully:", session.user.email);
        setThrowSignUp("PreviewPhase");
      }
    });
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <div>
      {throwSignUp === "signUpPhase" && <SupabaseClient />}
      {throwSignUp === "PreviewPhase" && (
        <div>
          <Header />
          <Carousel />
          <Cards />
        </div>
      )}
    </div>
  );
}
