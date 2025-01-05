import Link from "next/link";
import React from "react";

const DashboardCards = ({ icon, title, data, href }) => {
  return (
    <Link
      href={href}
      className="bg-white p-5 rounded-xl shadow-xl text-base font-bold text-end flex justify-around items-center gap-5 hover:text-primary"
    >
      {React.createElement(icon, { className: "text-[50px] text-primary" })}
      <div>
        <p>Total {title}</p>
        <p className="text-4xl mt-2">{data}</p>
      </div>
    </Link>
  );
};

export default DashboardCards;
