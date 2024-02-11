import SignInForm from "@/components/auth/SignInForm";

const page = () => {
  return (
    <div className="grid place-items-center h-screen ">
      <div className="w-2/4 border p-6 rounded-lg">
        <SignInForm />
      </div>
    </div>
  );
};

export default page;
