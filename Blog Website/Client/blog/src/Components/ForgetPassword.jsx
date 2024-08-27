import React, { useState } from "react";
import { TextInput, Button, Spinner, Alert } from "flowbite-react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [failureMessage, setFailureMessage] = useState(null);
  const [failure, setFailure] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFailure(false);
      setSuccess(false);
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setSuccess(true);
        setSuccessMessage(data.message);
      } else {
        setFailure(false);
        setFailureMessage(data.message);
      }
    } catch (err) {
      setFailure(false);
      setFailureMessage(err.message);
    }
  };
  return (
    <div className="min-h-screen flex justify-center flex-col gap-5 p-5 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-6xl font-bold font-sans">
            Forgot your Password?
          </h1>
          <p className="text-gray-400 text-8">
            Enter the email you signed up with and we will send you reset
            instructions.
          </p>
        </div>
        <div className="flex items-center gap-2 max-w-2xl">
          <TextInput
            className="w-full"
            type="email"
            placeholder="Enter your email"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            gradientDuoTone="purpleToPink"
            outline
            type="submit"
            className="flex justify-center items-center min-w-28"
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </div>
      </form>
      {success && <Alert color="info">{successMessage}</Alert>}
      {failure && <Alert color="failure">{failureMessage}</Alert>}
    </div>
  );
}

export default ForgetPassword;
