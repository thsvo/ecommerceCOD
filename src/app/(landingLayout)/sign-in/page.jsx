import LoginForm from "@/components/LandingPages/Login/LoginForm";
import LoginImage from "@/components/LandingPages/Login/LoginImage";

const SignIn = () => {
  return (
    <section className="bg-primaryLight/40 py-20 lg:flex justify-center gap-20 rounded-xl px-10 items-center mb-20">
      <LoginImage />
      <div>
        <h2 className="text-4xl font-bold">Welcome back!</h2>
        <p className="text-base text-textColor font-semibold">
          Enter your Credentials to access your account
        </p>
        <LoginForm />
      </div>
    </section>
  );
};

export default SignIn;
