import React, { useEffect, useRef, useState } from "react";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUseFailure,
  signOutSuccess,
  signOutFailure,
} from "./../store/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { app } from "./../firebase";

function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [ImageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [signout, setSignOut] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch(`api/user/signout/${currentUser.data._id}`, {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      setSignOut(err.message);
      dispatch(signOutFailure(err));
    }
  };
  const handleDeleteAccount = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser.data._id}`, {
        method: "DELETE",
      });
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteUserSuccess());
      } else {
        dispatch(deleteUseFailure(data.message));
      }
    } catch (err) {
      console.log(err);
      dispatch(deleteUseFailure(err.message));
    }
  };
  const handleFormSubmitEvent = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    if (imageFileUploading) {
      return;
    }
    try {
      setUserUpdateSuccess(null);
      setUserUpdateError(null);
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser.data._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUserUpdateSuccess("Profile updated successfully");
        dispatch(updateSuccess(data));
      } else {
        setUserUpdateError(data.message);
        dispatch(updateFailure());
      }
    } catch (err) {
      setUserUpdateError(err.message);
      dispatch(updateFailure());
    }
  };
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
    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };
  return (
    <div className="w-full max-w-lg  mx-auto p-3">
      <h1 className="text-4xl font-semibold my-7 text-center">
        {currentUser.data.username + "'s Profile"}
      </h1>
      <form
        className="flex flex-col justify-center gap-4"
        onSubmit={handleFormSubmitEvent}
      >
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
          onChange={handleChange}
          placeholder={currentUser.data.username}
        />
        <TextInput
          type="email"
          onChange={handleChange}
          id="email"
          placeholder={currentUser.data.email}
        ></TextInput>
        <TextInput
          text="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        ></TextInput>
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-700 mt-5">
        <span
          className="cursor-pointer my-2"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span onClick={handleSignOut}>Sign out</span>
      </div>
      {userUpdateSuccess && (
        <Alert color={"success"}>{userUpdateSuccess}</Alert>
      )}
      {userUpdateError && <Alert color={"failure"}>{userUpdateError}</Alert>}
      {error && <Alert color={"failure"}>{error}</Alert>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size={"md"}
        popup
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-600 dark:text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">
              Are you sure you want to delete your account?
            </h3>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center gap-4">
          <Button color={"failure"} onClick={handleDeleteAccount}>
            Yes, I'm sure
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DashProfile;
