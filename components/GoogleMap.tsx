"use client";
import React from "react";
import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";

type Props = {
  lat: string;
  lng: string;
};

const GoogleMap = ({lat, lng}: Props) => {
  const position = {lat: parseFloat(lat), lng: parseFloat(lng)};

  const onMarkClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    window.open(googleMapsUrl, "_blank");
  };

  return (
    <APIProvider apiKey={"AIzaSyCd8Pf-G56pL2JGK0Oq_ytbwYMRZ-evzAk"}>
      <Map
        // style={{width: "", height: "100vh"}}
        defaultCenter={position}
        defaultZoom={18}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <Marker position={position} onClick={onMarkClick} />
      </Map>
    </APIProvider>
  );
};

export default GoogleMap;
