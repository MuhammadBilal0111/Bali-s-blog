import React from "react";
import { TextInput, Button, Select } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  const [value, setValue] = useState("");
  const handleSubmitForm = () => {};
  const handleChange = () => {};
  return (
    <div className="p-3 min-h-screen min-w-3xl mx-auto">
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
          <Select id="category" placeholder="Select a category" requied>
            <option value="uncategorized">Select a category</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
            <option value="javascript">JavaScript</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center p-5 border-2 border-dashed">
          <TextInput
            type="file"
            accept="images/*"
            className="flex-1"
          ></TextInput>
          <Button
            onClick={handleImage}
            gradientDuoTone={"purpleToPink"}
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          className="h-72"
          theme="snow"
          value={value}
          placeholder="Write Something"
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
