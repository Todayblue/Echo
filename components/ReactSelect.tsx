import prisma from "@/lib/prisma";
import React from "react";
import Select from "react-tailwindcss-select";

type Props = {
  slug: string;
};

const ReactSelect = async ({ slug }: Props) => {
  const subcommunity = await prisma.subCommunity.findFirst({
    where: { slug: slug },
  });
  // console.log("subcommunity", subcommunity);

  return (
    <div></div>
    // <Select
    //   primaryColor={"blue"}
    //   value={topic}
    //   onChange={handleSelectChange}
    //   options={options}
    // />
  );
};

export default ReactSelect;
