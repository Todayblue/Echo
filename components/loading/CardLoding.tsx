import React from "react";
import ContentLoader from "react-content-loader";

type Props = {
  width?: number;
  hight?: number;
};

const CardLoding = ({width, hight}: Props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={460}
    viewBox="0 0 400 460"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="60" rx="2" ry="2" width={width} height={hight}/>
  </ContentLoader>
);

export default CardLoding;
