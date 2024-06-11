"use client";
import "react-quill/dist/quill.snow.css";
import React, { HTMLProps, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { TOOLSBAR } from "./constants";

type EditorProps = {
  value?: string;
  onChange?: (value: string) => void; // Change the type of onChange
  placeholder?: string;
  className?: HTMLProps<HTMLElement>["className"];
};

const Editor = ({ value, onChange, placeholder,className }: EditorProps) => {
  const modules = {
    toolbar: TOOLSBAR,
  };

  const handleChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className={className}>
      <ReactQuill
        className="prose prose-lg resize-y"
        placeholder={placeholder}
        value={value}
        theme="snow"
        onChange={handleChange}
        modules={modules}
      />
    </div>
  );
};

export default Editor;
