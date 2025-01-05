import NotFoundAnimation from "@/components/Shared/NotFoundAnimation";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <NotFoundAnimation />
      <Link href="/">
        <button className="bg-primary text-white w-full font-bold px-12 py-2 rounded-full hover-fade border-2 border-primary">
          Return Home
        </button>
      </Link>
    </section>
  );
};

export default NotFound;
