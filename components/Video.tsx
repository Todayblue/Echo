import React from 'react'

type Props = {
  src: string;
  width?: string;
  hight?: string;
  className?: string | undefined;
};

const Video = ({src, width, hight, className}: Props) => {
  return (
    <video
      width={width}
      height={hight}
      controls
      preload="true"
      className={className}
      src={src}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default Video