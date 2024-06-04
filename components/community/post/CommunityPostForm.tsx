"use client";
import PostForm from "@/components/PostForm";
import AboutCommunity from "@/components/community/comment/AboutCommunity";
import RuleList from "@/components/community/rule/RuleList";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {CommunityDetails, DropdownOption} from "@/types/common";
import {GetCommunityDetailsById} from "@/services/community";
import {CardHeader} from "@/components/ui/card";

type Props = {
  defaultCommunityDDL: DropdownOption;
};

const CommunityPostForm = ({defaultCommunityDDL}: Props) => {
  const [communityId, setCommunityId] = useState<string>(
    defaultCommunityDDL.value
  );

  const {data: community} = useQuery<CommunityDetails>({
    queryKey: ["community", communityId],
    queryFn: () => GetCommunityDetailsById(communityId),
  });

  return (
    <>
      <div className="grid mx-auto grid-cols-6 gap-x-6 py-6 w-full">
        <div className="col-span-4 space-y-4">
          <CardHeader className="font-semibold text-2xl border-b pb-3 px-0">
            Create a post
          </CardHeader>
          <PostForm
            setCommunityId={setCommunityId}
            defaultCommunityDDL={defaultCommunityDDL}
          />
        </div>

        <div className="col-span-2 space-y-4 ">
          <div className="sticky top-0">
            <div className="overflow-y-auto max-h-screen">
              <div className="grid gap-4 ">
                {community && (
                  <AboutCommunity
                    community={community}
                    memberCount={community?._count.subscribers || 0}
                  />
                )}
                {community?.rule && community?.rule.length > 0 && (
                  <RuleList community={community} rules={community?.rule} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPostForm;
