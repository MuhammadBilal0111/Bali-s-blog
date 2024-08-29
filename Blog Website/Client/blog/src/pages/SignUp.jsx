import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRef } from "react";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const passwordInput = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const confirmPasswordInput = useRef();
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "failed") {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      //if internet is not working
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="mt-20 min-h-screen">
      <div className="flex gap-5 items-center px-3  max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link
            to={"/"}
            className="whitespace-nowrap font-bold dark:text-white text-5xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-gray-500 to-gray-900 rounded-xl text-white">
              Bali's
            </span>
            Blogs
          </Link>
          <p className="mt-5 text-md ">
            This is a demo project. You can sign up with your email and password
            or with your gmail
          </p>
        </div>
        <div className="flex-1 w-[100%]">
          <form onSubmit={handleSubmitForm} className="flex flex-col gap-3">
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                id="username"
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="JohnDoe@example.com"
                onChange={handleChange}
                id="email"
              />
            </div>
            <div>
              <Label value="Password" />
              <div className="relative">
                <TextInput
                  type="password"
                  id="password"
                  ref={passwordInput}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {!showPassword ? (
                  <FaRegEyeSlash
                    className="text-gray-200 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setShowPassword(true);
                      passwordInput.current.type = "text";
                    }}
                  />
                ) : (
                  <FaRegEye
                    className="text-gray-500 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setShowPassword(false);
                      passwordInput.current.type = "password";
                    }}
                  />
                )}
              </div>
            </div>
            <div>
              <Label value="Confirm Password" />
              <div className="relative">
                <TextInput
                  type="password"
                  placeholder="Confirm password"
                  ref={confirmPasswordInput}
                  id="confirmPassword"
                  onChange={handleChange}
                />
                {!showConfirmPassword ? (
                  <FaRegEyeSlash
                    className="text-gray-200 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setShowConfirmPassword(true);
                      confirmPasswordInput.current.type = "text";
                    }}
                  />
                ) : (
                  <FaRegEye
                    className="text-gray-200 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setShowConfirmPassword(false);
                      confirmPasswordInput.current.type = "password";
                    }}
                  />
                )}
              </div>
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3 text-sm">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-1 my-3">
            <span>Aleady have an account?</span>
            <Link to={"/sign-in"} className="text-blue-700 hover:underline">
              Sign in
            </Link>
          </div>
          {errorMessage && (
            <Alert className="my-4" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
