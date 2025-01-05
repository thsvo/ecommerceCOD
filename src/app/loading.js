import LoadingAnimation from "@/components/Shared/LoadingAnimation";

const loading = () => {
  return (
    <section className="h-screen flex items-center justify-center">
      <LoadingAnimation />
    </section>
  );
};

export default loading;
