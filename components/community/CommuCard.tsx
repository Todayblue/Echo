import Image from "next/image";
import React from "react";

type Card = {
  author: string;
  title: string;
  img?: string;
};

const testCardData: Card[] = [
  {
    author: "Panda",
    title: "Can coffee make you a better developer?",
    img: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "TT",
    title: "Can coffee make you a better developer?",
  },
];

type CommuCardProps = {
  author: string;
  title: string;
  image?: string;
};

const CommuCard = ({ author, title, image }: CommuCardProps) => {
  return (
    <div className=" w-full">
      <div className="border border-gray-300  bg-white  p-4 flex flex-col justify-between leading-normal rounded-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-600 flex items-center">
            Posted by : {author}
          </p>
          <div className="text-gray-900 font-bold text-xl">{title}</div>

          {image && (
            <figure className="flex justify-center pt-4">
              <Image
                src={image}
                alt={`picture of ${author}`}
                width={500}
                height={500}
                // sizes="(max-width: 768px) 100vw, 33vw"
                className="m-h-[512px]"
              />
            </figure>
          )}

          {/* <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p> */}
        </div>
      </div>
    </div>
  );
};

export default CommuCard;
