import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "lucide-react";

export default function Home() {
  return (
    <main>
      <div className="grid  min-h-screen  bg-gray-300 ">
        <div className="py-16 mx-24 ">
          <div className="grid place-content-center lg:grid-cols-6  gap-6 md:grid-cols-1 ">
            {/* <ToFeedButton /> */}
            <div className="col-span-4 space-y-4">
              <div className="flex flex-row space-x-3 p-2 w-full border border-gray-300 rounded-md bg-white">
                <Avatar className="flex flex-none">
                  <AvatarImage src="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Input placeholder="Create Post..." />
              </div>
            </div>
            {/* info sidebar */}
            <div className="col-span-2 flex flex-col space-y-4">
              {/* <AboutCommunity
                session={session}
                memberCount={memberCount}
                slug={community.slug}
                createdAt={community.createdAt}
                creatorId={community.creatorId}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
