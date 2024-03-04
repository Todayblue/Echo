import AboutCommunity from "@/components/community/comment/AboutCommunity";
import UserTabs from "@/components/user/UserTabs";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {UserCog} from "lucide-react";
import {notFound} from "next/navigation";

export default async function Layout({
  children,
  params: {username},
}: {
  children: React.ReactNode;
  params: {username: string};
}) {
  const session = await getAuthSession();

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return (
    <div className="bg-secondary ">
      <div className="grid ">
        <div className="pt-2 ">
          <UserTabs user={session?.user} />
        </div>

        <div className="grid grid-cols-6 mx-32 gap-x-6 py-4">
          <div className="col-span-4">{children}</div>
          <div className="col-span-2">
            <div className="w-screen  md:w-full bg-white h-fit  border border-gray-300 order-first md:order-last rounded-md">
              <div className="">
                <div className="bg-sky-500 h-20 rounded-t-md"></div>
              </div>
              <div className="relative w-full h-24 py-3 bg-white border border-b-gray-200 ">
                <div className="mx-4 ">
                  <div className="w-full absolute -top-8">
                    <div className="flex flex-row justify-between items-center ">
                      <img
                        className="w-14 h-14 rounded"
                        src={user?.image || ""}
                        alt={user?.username || ""}
                      />
                      <div className="mr-6 mt-8">
                        <UserCog />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
