import { UserSetting } from "@/components/UserSetting";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-screen bg-white">
      <div className="grid place-items-center  py-8 ">
        <div className="w-2/4 border p-6 rounded-lg">
          <UserSetting />
        </div>
      </div>
    </div>
  );
};

export default page;
