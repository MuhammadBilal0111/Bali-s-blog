import React from "react";
import { Button } from "flowbite-react";
function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full border justify-center items-center border-teal-500 p-4 rounded-tl-3xl rounded-br-3xl rounded-tb-none text-center">
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl pb-2 font-bold">
          Want to Learn MERN stack development by building fun and innovative
          projects?
        </h1>
        <p className="text-gray-500 font-semibold">
          Here are multiple beneficial resources to learn the MERN stack
          development and start building your own projects
        </p>
        <Button
          className="rounded-tl-xl w-full rounded-bl-none my-4"
          gradientDuoTone={"purpleToPink"}
        >
          <a href="/google.com" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Button>
      </div>
      <div className="flex-1">
        <img
          className="w-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSjtynhlJLcf-snjNi9wi5tmQ_ZNZBnqObQ&s"
          alt="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg2Ec7d7mcr5P7Y6CvLUePUSjh9tx1NQjoVg&s"
        />
      </div>
    </div>
  );
}

export default CallToAction;
