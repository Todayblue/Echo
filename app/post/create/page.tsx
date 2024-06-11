"use client";
import PostForm from "@/components/PostForm";
import AboutCommunity from "@/components/community/comment/AboutCommunity";
import RuleList from "@/components/community/rule/RuleList";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {GetCommunityDetailsById} from "@/services/community";
import {Card} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import pfp from "@/public/pfp.png";

const rules = [
  {
    id: 1,
    text: "Remember the human",
  },
  {
    id: 2,
    text: "Behave like you would in real life",
  },
  {
    id: 3,
    text: "Look for the original source of content",
  },
  {
    id: 4,
    text: "Search for duplication before posting",
  },
  {
    id: 5,
    text: "Read the community guidlines",
  },
];

const Page = () => {
  const [communityId, setCommunityId] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(true);

  const {data: community} = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => GetCommunityDetailsById(communityId),
  });

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <h1 className="font-semibold text-lg border-b pb-3">Create a post</h1>
        <PostForm setIsDefault={setIsDefault} setCommunityId={setCommunityId} />
      </div>
      <div className="w-[35%]">
        <div className="flex flex-col space-y-6">
          {community && (
            <AboutCommunity
              community={community}
              memberCount={community?._count.subscribers || 0}
            />
          )}
          {community?.rule && community?.rule.length > 0 ? (
            <RuleList community={community} rules={community?.rule} />
          ) : (
            <Card className="flex flex-col p-4 order-first md:order-last">
              <div className="flex items-center gap-x-2">
                <Image className="h-10 w-10" src={pfp} alt="pfp" />
                <h1 className="font-medium">Posting Rule</h1>
              </div>
              <Separator className="mt-2" />

              <div className="flex flex-col gap-y-5 mt-5">
                {rules.map((item) => (
                  <div key={item.id}>
                    <p className="text-sm font-medium">
                      {item.id}. {item.text}
                    </p>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
