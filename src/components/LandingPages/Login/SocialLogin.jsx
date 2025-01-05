import React from "react";
import {
  FaFacebook,
  FaGoogle,
  FaApple,
  FaSquareXTwitter,
} from "react-icons/fa6";

const SocialLogin = () => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6 mx-10">
      <button>
        <FaFacebook className="text-6xl bg-white p-3 rounded-full text-black border border-textColor hover:scale-110 duration-300" />
      </button>
      <button>
        <FaGoogle className="text-6xl bg-white p-3 rounded-full text-black border border-textColor hover:scale-110 duration-300" />
      </button>
      <button>
        <FaSquareXTwitter className="text-6xl bg-white p-3 rounded-full text-black border border-textColor hover:scale-110 duration-300" />
      </button>
      <button>
        <FaApple className="text-6xl bg-white p-3 rounded-full text-black border border-textColor hover:scale-110 duration-300" />
      </button>
    </div>
  );
};

export default SocialLogin;
