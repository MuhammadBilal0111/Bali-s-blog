import React from "react";
import CallToAction from "./../Components/CallToAction";
function Projects() {
  return (
    <div className="min-h-screen flex flex-col my-7 gap-7 items-center">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold my-6 text-center">
          Projects to practice as a beginner
        </h1>
        <p className="text-center text-md text-gray-500">
          Create compelling projects to enhance your resume and stand out in the
          competitive web development field.{" "}
        </p>
      </div>
      <div className="max-w-6xl mx-auto flex justify-center items-center p-4">
        <CallToAction />
      </div>
    </div>
  );
}

export default Projects;
