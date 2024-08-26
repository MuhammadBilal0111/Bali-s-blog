import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

function FooterComp() {
  return (
    <Footer container className="border-t-8 rounded-md border-teal-600">
      <div className="w-full  max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap font-semibold dark:text-white text-lg sm:text-xl"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-gray-500 to-gray-900 rounded-lg text-white">
                Bali's
              </span>
              Blogs
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-6 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  100 JS projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blogs
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Linkedin
                </Footer.Link>
                <Footer.Link href="#">Github</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="sm:flex w-full sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Bali's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex sm:mt-0 gap-6 mt-4 sm:justify-center">
            <Footer.Icon className="" href="#" icon={FaFacebook} />
            <Footer.Icon href="#" icon={AiFillInstagram} />
            <Footer.Icon href="#" icon={FaSquareXTwitter} />
            <Footer.Icon href="#" icon={FaDiscord} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComp;
