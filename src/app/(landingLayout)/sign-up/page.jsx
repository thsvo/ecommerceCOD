import SignUpForm from "@/components/LandingPages/SignUp/SignUpForm";
import SignUpImage from "@/components/LandingPages/SignUp/SignUpImage";

const SignUp = () => {
  return (
    <section className="bg-primaryLight/40 py-20 lg:flex justify-center gap-20 rounded-xl px-10 items-center mb-20">
      <SignUpImage />
      <div>
        <h2 className="text-4xl font-bold">Get Started Now!</h2>
        <p className="text-base text-textColor font-semibold">
          Register now to enjoy all the features
        </p>
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUp;
