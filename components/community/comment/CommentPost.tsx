import Editor from "@/components/editor/Editor";
import TextEditor from "@/components/text-editor/TextEditor";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

const CommentPost = (props: Props) => {
  return (
    <div className="flex flex-col space-y-5  p-4  border border-gray-300 rounded-md bg-white">
      <p className="text-lg font-bold text-gray-900 mx-6">Comments</p>
      <div className="mx-10 my-2">
        <Editor />
      </div>
      <Button>Ghost</Button>
    </div>
  );
};

export default CommentPost;
