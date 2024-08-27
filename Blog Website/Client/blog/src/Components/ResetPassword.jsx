import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TextInput, Button, Spinner, Alert } from "flowbite-react";
import {
  resetPasswordStart,
  resetPasswordFailure,
  resetPasswordSuccess,
} from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

function ResetPassword() {
  const { resetPasswordToken } = useParams();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return dispatch(
        resetPasswordFailure("Password and Confirm password is not same")
      );
    }
    try {
      dispatch(resetPasswordStart());
      const res = await fetch(
        `/api/auth/reset-password/${resetPasswordToken}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log("kyf", data);
      if (res.ok) {
        setSuccess(true);
        setSuccessMessage(
          "Password has been changed. Please Log in with new password!"
        );
        dispatch(resetPasswordSuccess(data));
      } else {
        return dispatch(resetPasswordFailure(data.message));
      }
    } catch (err) {
      dispatch(resetPasswordFailure(err.message));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex justify-center flex-col gap-5 p-5 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-6xl font-bold font-sans">Reset Password</h1>
          <p className="text-gray-400 text-8">
            Create a strong new password to secure your account.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 max-w-2xl">
          <TextInput
            className="w-full"
            type="password"
            placeholder="Enter your new password"
            id="password"
            required
            onChange={handleChange}
          />
          <div className="flex gap-2 w-full">
            <TextInput
              className="w-full"
              type="password"
              placeholder="Confirm your new password"
              id="confirmPassword"
              required
              onChange={handleChange}
            />
            <Button
              gradientDuoTone="purpleToPink"
              outline
              type="submit"
              className="flex justify-center items-center min-w-28"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </div>
        </div>
      </form>
      {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      {success && <Alert color="info">{successMessage}</Alert>}
    </div>
  );
}

export default ResetPassword;
