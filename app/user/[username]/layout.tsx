import UserTabs from "@/components/user/UserTabs";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {UserCog} from "lucide-react";
import {redirect} from "next/navigation";

export default async function Layout({
  children,
  params: {username},
}: {
  children: React.ReactNode;
  params: {username: string};
}) {
  const session = await getAuthSession();

  if (!session) return redirect("/");

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return (
    <div className="grid bg-secondary min-h-screen">
      <div className="pt-2 ">
        <UserTabs user={session?.user} />
      </div>

      <div className="grid grid-cols-6 mx-32 gap-x-6 py-4">
        <div className="col-span-4">{children}</div>
        <div className="col-span-2">
          {/* <div className="">
              <div className="bg-sky-500 h-20 rounded-t-md"></div>
            </div> */}

          <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
            <div className="rounded-t-lg overflow-hidden">
              <div className="bg-sky-500 h-32"></div>
            </div>
            <div className="mx-auto w-24 h-24 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
              <img
                className="object-cover object-top w-full"
                src={user?.image || ""}
                alt={user?.username || ""}
              />
            </div>
            <div className="text-center mt-2">
              <h2 className="font-semibold">Sarah Smith</h2>
              <p className="text-gray-500">Freelance Web Designer</p>
            </div>
            <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
              <li className="flex flex-col items-center justify-around">
                <svg
                  className="w-4 fill-current text-blue-900"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <div>2k</div>
              </li>
              <li className="flex flex-col items-center justify-between">
                <svg
                  className="w-4 fill-current text-blue-900"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
                </svg>
                <div>10k</div>
              </li>
              <li className="flex flex-col items-center justify-around">
                <svg
                  className="w-4 fill-current text-blue-900"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
                </svg>
                <div>15</div>
              </li>
            </ul>

            <div className="p-4 border-t mx-8 mt-2">
              <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
                Follow
              </button>
            </div>
          </div>
          {/* <div className="relative w-full h-24 py-3 bg-white border border-b-gray-200 ">
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
               <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-2">Todayblue</h2>
              <p className="text-xl font-normal mb-2">@todayblue</p>
              <div className="flex items-center space-x-2 mb-4">
                {/* <ShareIcon className="text-gray-500" />
              </div>
              <p className="text-gray-700 mb-4">
                Product designer. I love creating beautiful and functional
                interfaces. Currently working
              </p>
              <hr className="mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-lg font-semibold">1</div>
                  <div className="text-sm text-gray-600">Post Karma</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">0</div>
                  <div className="text-sm text-gray-600">Comment Karma</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-semibold">Mar 13, 2024</div>
                  <div className="text-sm text-gray-600">Cake day</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">0</div>
                  <div className="text-sm text-gray-600">Gold Received</div>
                </div>
              </div>
            </div>
            </div> */}
        </div>
      </div>
    </div>
  );
}
