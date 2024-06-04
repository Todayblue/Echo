"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {DropdownOption} from "@/types/common";

type Props = {
  handleSelectSort: (value: string) => void;
  handleSelectTime: (value: string) => void;
  sortTimeoptions: DropdownOption[];
  sortOptions: DropdownOption[];
};

const SelectFilterTabs = ({
  handleSelectSort,
  handleSelectTime,
  sortTimeoptions,
  sortOptions,
}: Props) => {
  return (
    <div className="flex items-center py-1">
      <div className="flex space-x-2">
        <Select onValueChange={handleSelectSort}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="New" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleSelectTime}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            {sortTimeoptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <hr className="flex-grow ml-2 my-4 border-gray-300 dark:border-gray-700" />
    </div>
  );
};

export default SelectFilterTabs;
