"use client";
import PostForm from "@/components/PostForm";
import AboutCommunity from "@/components/community/comment/AboutCommunity";
import RuleList from "@/components/community/rule/RuleList";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {CommunityDetails, DropdownOption} from "@/types/common";
import {GetCommunityDetailsById} from "@/services/community";

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
      <div className="w-[65%] flex flex-col gap-y-5">
        <h1 className="font-semibold text-lg border-b pb-3">Create a post</h1>
        <PostForm
          setCommunityId={setCommunityId}
          defaultCommunityDDL={defaultCommunityDDL}
        />
      </div>
      <div className="w-[35%]">
        <div className="grid gap-y-6">
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
    </>
  );
};

export default CommunityPostForm;
