"use client";

import { FaShare, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { HiX } from "react-icons/hi";
import { SiX } from "react-icons/si";
import { toast } from "sonner";
import { useState } from "react";
import { Modal } from "antd";

const ShareModal = ({ shareUrl }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setModalOpen(true)}
          className="text-white bg-gray-700 p-2 rounded-full hover:scale-105 duration-300"
        >
          <FaShare />
        </button>
      </div>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        closeIcon={
          <HiX className="text-2xl text-gray-600 hover:text-gray-800" />
        }
        centered
      >
        <h2 className="text-lg font-bold mb-4 text-black">Share This Post</h2>
        <div className="flex justify-around mb-4 mt-10">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-4xl"
          >
            <FaFacebook />
          </a>
          <a
            href={`https://x.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-3xl"
          >
            <SiX />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-4xl"
          >
            <FaLinkedin />
          </a>
          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 text-4xl"
          >
            <FaInstagram />
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 p-2 bg-gray-800 text-white rounded-lg"
          >
            <IoIosLink />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ShareModal;
