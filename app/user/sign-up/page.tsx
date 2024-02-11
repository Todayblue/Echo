import SignUpForm from "@/components/auth/SignUpForm";

const page = () => {
  return (
    <div className="h-screen">
      <div className="grid place-items-center  py-8 ">
        <div className="w-2/4 border p-6 rounded-lg">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default page;
