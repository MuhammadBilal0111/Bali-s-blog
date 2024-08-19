import React from "react";
import { TextInput, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {};
  return (
    <div className="w-full max-w-lg  mx-auto p-3">
      <h1 className="text-4xl font-semibold my-7 text-center">{currentUser.data.username+"'s Profile"}</h1>
      <form className="flex flex-col justify-center gap-4">
        <div className="rounded-full w-40 h-40 cursor-pointer self-center">
          <img
            className="rounded-full object-cover w-full h-full border-8 border-[lightgray]"
            src={currentUser.data.profilePicture}
            alt="user"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder={currentUser.data.username}
        />
        <TextInput
          type="email"
          placeholder={currentUser.data.email}
        ></TextInput>
        <TextInput text="password" placeholder="Password"></TextInput>
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          onClick={handleSubmit}
          outline
        >
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-700 mt-5">
        <Link>
          <span>Delete Account</span>
        </Link>
        <Link>
          <span>Sign out</span>
        </Link>
      </div>
    </div>
  );
}

export default DashProfile;
