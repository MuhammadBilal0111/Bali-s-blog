import React, { useEffect, useRef, useState } from "react";
import { TextInput, Button, Alert } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "./../firebase";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [ImageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {};
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploadError(null);
    console.log(imageFile);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed", // track the changes when image is uploading
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        setImageFileUploadError(
          "Could not upload image (File must be less than 2 MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUrl(downloadUrl);
        });
      }
    );
  };
  return (
    <div className="w-full max-w-lg  mx-auto p-3">
      <h1 className="text-4xl font-semibold my-7 text-center">
        {currentUser.data.username + "'s Profile"}
      </h1>
      <form className="flex flex-col justify-center gap-4">
        <input
          type="file"
          accept="images/*"
          onChange={handleImageChange}
          hidden
          ref={filePickerRef}
        />
        <div
          className="relative rounded-full w-40 h-40 cursor-pointer self-center"
          onClick={() => filePickerRef.current.click()}
        >
          {ImageFileUploadProgress && (
            <CircularProgressbar
              value={ImageFileUploadProgress}
              text={`${ImageFileUploadProgress}%`}
              styles={{
                root: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                },
                path: {
                  stroke: `rgba(62,152,199,${ImageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className={`rounded-full object-cover w-full h-full border-7 border-[lightgray] ${
              ImageFileUploadProgress &&
              ImageFileUploadProgress < 100 &&
              "filter blur-sm"
            }`}
            src={imageUrl || currentUser.data.profilePicture}
            alt=""
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"red"}>{imageFileUploadError}</Alert>
        )}
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
