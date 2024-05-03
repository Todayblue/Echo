"use client";

import {Prisma, Community} from "@prisma/client";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import {usePathname, useRouter} from "next/navigation";
import {FC, useCallback, useEffect, useRef, useState} from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {useOnClickOutside} from "@/hooks/use-on-click-outside";
import {Search, Users} from "lucide-react";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const {data} = await axios.get(`/api/search/community?q=${input}`);
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text: string) => {
          setInput(text);
          debounceRequest();
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search"
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((community) => (
                <CommandItem
                  onSelect={(e: any) => {
                    router.push(`/community/${e}`);
                    router.refresh();
                  }}
                  key={community.id}
                  value={community.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/community/${community.slug}`}>{community.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          <CommandItem>
            <a href={`/search?q=${input}&type=post`}>Search for {input}</a>
          </CommandItem>
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
