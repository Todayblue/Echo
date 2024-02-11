import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

type Props = {
  tags: {
    slug: string | null;
    name: string;
  }[];
  currentSlug: string;
};

const BlogTags = ({ tags, currentSlug }: Props) => {
  return (
    <Carousel className="w-full max-w-5xl">
      <CarouselContent className="flex -ml-4">
        {tags.map((tag) => (
          <CarouselItem
            key={tag.slug}
            className="grow md:basis-1/6 lg:basis-1/12"
          >
            <div className="flex items-center justify-center ">
              <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                <Button
                  variant={"outline"}
                  className={`${
                    currentSlug === tag.slug
                      ? "bg-primary text-white"
                      : "bg-secondary "
                  }`}
                >
                  #{tag.name}
                </Button>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    // <div className="md:px-10 sxl:px-20 my-6 py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10">
    //   {tags.map((tag) => (
    // <Link
    //   key={tag.slug}
    //   href={`/blog/tag/${tag.slug}`}
    // className={`inline-block py-1.5 md:py-2 px-6 md:px-10 rounded-full border-2 border-solid border-black dark:border-white hover:scale-105 transition-all ease duration-200 m-2 ${
    //   currentSlug === tag.slug
    //     ? "bg-black text-white"
    //     : "bg-white text-black"
    // }`}
    // >
    //   #{tag.name}
    // </Link>
    //   ))}
    // </div>
  );
};

export default BlogTags;
