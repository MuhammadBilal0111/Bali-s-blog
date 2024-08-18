import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../store/userSlice";
import OAuth from "../Components/OAuth";

function SignIn() {
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.status === "failed") {
        return dispatch(signInFailure(data.message));
        // setLoading(false);
        // return setErrorMessage(data.message);
      }
      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      //if internet is not working
      // setErrorMessage(error.message);
      // setLoading(false);
      dispatch(signInFailure(error.message));
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
            <Link
              to={"forgetPassword"}
              className="text-blue-600 hover:underline font-semibold"
            >
              Forget Password
            </Link>
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
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-1 my-3">
            <span>Don't have an account?</span>
            <Link to={"sign-up"} className="text-blue-600 hover:underline">
              Sign Up
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

export default SignIn;
