import React from "react";

const Messages = () => {
  return (
    <div className="border-2 min-h-screen bg-[url(https://images.unsplash.com/photo-1711062717319-393e424a3538?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
      <h1 className="text-center text-4xl p-5 font-serif italic">
        Messages from Us
      </h1>
      <hr className="w-50 mx-auto" />
      <section className="w-full flex flex-row flex-wrap justify-center gap-4 p-8 ">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className=" flex-1 h-fit min-w-[500px] max-w-[500px] p-6 rounded-xl  hover:rotate-2 transition-all duration-300 bg-white/25 backdrop-filter backdrop-blur-md"
          >
            <p className="text-shadow-lg/30 font-serif italic">
              "Your music has been the soundtrack to so many beautiful moments
              in my life. Thank you for sharing your gift with the world!"
            </p>
            <p className="text-end text-amber-600 text-shadow-lg/30 italic">
              -name-
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Messages;
