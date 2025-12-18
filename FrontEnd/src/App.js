import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AuthForm from "./components/AuthForm";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  return (
    <>
      {loggedIn ? (
        <>
          <Header 
            setLoggedIn={setLoggedIn}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
          />
          
          <Hero showProfile={showProfile} />
        </>
      ) : (
        <AuthForm setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;
