import Link from "next/link";
import React from "react";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Button} from "../ui/button";

type Props = {
  tags: {
    slug: string | null;
    name: string;
  }[];
  currentSlug: string;
};

const BlogTags = ({tags, currentSlug}: Props) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-4">
        {tags.map((tag) => (
          <CarouselItem
            key={tag.slug}
            className="pl-4 md:pl-6 lg:pl-8 xl:pl-10 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="flex items-center justify-center">
              <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                <Button
                  variant={"outline"}
                  className={`${
                    currentSlug === tag.slug
                      ? "bg-primary text-white"
                      : "bg-secondary"
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
  );
};

export default BlogTags;
