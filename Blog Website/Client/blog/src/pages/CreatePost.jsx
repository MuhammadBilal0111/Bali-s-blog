import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TextInput, Button, Select, FileInput, Alert } from "flowbite-react";
import { useState } from "react";
import { app } from "./../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "./../store/userSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
function CreatePost() {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setForm] = useState({});
  const [ImageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const handleSubmitForm = () => {};
  const handleUploadImage = async () => {
    try {
      setImageFileUploadError(null);
      setImageFileUploading(true);
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (err) => {
          setImageFileUploadError("Image upload failed");
          ImageFileUploadProgress(null);
          setImageFileUploading(false);
          setFile(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadImageUrl) => {
            setImageUrl(downloadImageUrl);
            setImageFileUploadProgress(null);
            setImageFileUploadError(null);
            setImageFileUploading(false);
            setForm({ ...formData, imageUrl: downloadImageUrl });
          });
        }
      );
    } catch (err) {
      setImageFileUploadError("Image Upload failed");
      setImageFileUploadProgress(null);
      console.log(err);
    }
  };
  console.log(formData, imageUrl);
  const handleImageChange = () => {};
  const handleChange = () => {};
  return (
    <div className="p-3 min-h-screen mx-auto min-w-7">
      <h1 className="text-center text-3xl font-bold my-7">Create Post</h1>
      <form
        className="text-center flex flex-col gap-4"
        onSubmit={handleSubmitForm}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            type="text"
            id="title"
            className="flex-1"
            placeholder="Title"
            required
          ></TextInput>
          <Select id="category" placeholder="Select a category" required>
            <option value="uncategorized">Select a category</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
            <option value="javascript">JavaScript</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center p-5 border-2 border-dashed">
          <FileInput
            type="file"
            accept="images/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setImageFileUploadError(null);
            }}
            className="flex-1"
          ></FileInput>
          <Button
            onClick={handleUploadImage}
            gradientDuoTone={"purpleToPink"}
            outline
            disabled={ImageFileUploadProgress}
          >
            {ImageFileUploadProgress ? (
              <div className="w-8 h-8">
                <CircularProgressbar
                  value={ImageFileUploadProgress}
                  text={`${ImageFileUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="upload"
            className="object-cover w-full h-72"
          />
        )}
        <ReactQuill
          className="h-72 mb-14"
          theme="snow"
          value={value}
          placeholder="Write Something..."
          onChange={setValue}
        />
        <Button className="w-full" type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
