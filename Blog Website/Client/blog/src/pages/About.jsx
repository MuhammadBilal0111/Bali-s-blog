import React from "react";

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto p-3 my-3 max-h-full">
        <div>
          <h1 className="font-bold text-4xl lg:text-6xl  text-center my-3">
            About Bali's blog
          </h1>
        </div>
        <div className="text-md text-center flex flex-col gap-6 text-gray-500">
          <p>
            Bali's blog that I have created to sahre my thoughts and ideas with
            the world. I am a third year Software engineering student at NED
            University, Karachi. I want to write my experiences and things that
            I have learned.
          </p>
          <p>
            Our mission is to be your trusted resource for all things web
            development. I aim to provide practical guides, in-depth tutorials.
            Whether you're working on your first website or building complex web
            applications, our blog is here to support your journey.
          </p>
          <p>
            I encourage you to leave comments on the posts and help other
            readers. You can like other people comments. I believe that this
            blog can help the new developers to get grow and improve
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
