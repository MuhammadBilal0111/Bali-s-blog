import React from "react";
import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";
import { app } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "./../store/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app); // initializes the Firebase Authentication service

  const handleGoogleClick = async () => {
    // waiting from google
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // ask for select an account
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <span>Continue with google</span>
      <FaGoogle className="w-6 h-6 ml-2" />
    </Button>
  );
}

export default OAuth;
