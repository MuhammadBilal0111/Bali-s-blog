import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  TextInput,
  Button,
  Select,
  FileInput,
  Alert,
  Spinner,
} from "flowbite-react";
import { useState } from "react";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setForm] = useState({});
  const [ImageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataSuccess, setDataSuccess] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setDataSuccess(false);

      setDataLoading(true);
      const res = await fetch("/api/post/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setDataLoading(false);
      if (!res.ok) {
        setPublishError(data.message);
      } else {
        setDataSuccess(true);
        navigate(`/post/${data.post.slug}`);
        setPublishError(null);
      }
    } catch (err) {
      setDataLoading(false);
      setPublishError("Something Went Wrong");
    }
  };
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
    }
  };
  const handleChange = (e) => {
    setForm({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <div className="p-3 min-h-screen mx-auto max-w-4xl px-4">
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
            onChange={handleChange}
            required
          ></TextInput>
          <Select id="category" onChange={handleChange} required>
            <option value="uncategorized">Select a category</option>
            <option value="Reactjs">React JS</option>
            <option value="Nextjs">Next JS</option>
            <option value="NodeJs">Node JS</option>
            <option value="JavaScript">JavaScript</option>
            <option value="SQL">SQL</option>
            <option value="DBMS">DBMS</option>
            <option value="CSS">CSS</option>
            <option value="tailwindCSS">TailwindCSS</option>
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
          placeholder="Write Something..."
          onChange={(value) => {
            setForm({ ...formData, content: value });
          }}
        />
        <Button className="w-full" type="submit" gradientDuoTone="purpleToPink">
          {dataLoading && (
            <Spinner
              className="mx-3"
              size={"sm"}
              color="info"
              aria-label="Info spinner example"
            />
          )}
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-4" color={"failure"}>
            {publishError}
          </Alert>
        )}
        {dataSuccess && (
          <Alert className="mt-2" color={"gray"}>
            Post Successfully Published!
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
