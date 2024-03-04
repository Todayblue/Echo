"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
type Props = {
  blogs: {
    id: number;
    title: string;
    coverImage: string;
  }[];
};

const BlogCarousel = ({ blogs }: Props) => {
  return (
    <div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {blogs.map((blog) => (
            <CarouselItem key={blog.id}>
              <div className="p-1">
                <Card>
                  <div className="flex flex-col">
                    <img
                      className="w-full object-cover rounded-t-md h-48"
                      src={blog.coverImage}
                      alt="Modern building architecture"
                    />

                    <a
                      href="#"
                      className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
                    >
                      Incredible accommodation for your team
                    </a>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default BlogCarousel;
