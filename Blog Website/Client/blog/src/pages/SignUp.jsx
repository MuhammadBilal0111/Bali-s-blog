import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="mt-20">
      <div className="flex gap-5 items-center px-3  max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link
            to={"/"}
            className="whitespace-nowrap font-bold dark:text-white text-5xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white">
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
              <TextInput
                type="password"
                id="password"
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div>
              <Label value="Confirm Password" />
              <TextInput
                type="password"
                id="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm Password"
              />
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
            <Link to={"sign-in"} className="text-blue-700 hover:underline">
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
