import React from "react";
import ContentLoader from "react-content-loader";

const CommunityCardLoading = () => (
  <ContentLoader
    speed={2}
    viewBox="0 0 476 124"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="48" y="2" rx="3" ry="3" width="363" height="10" />
    <rect x="49" y="20" rx="3" ry="3" width="150" height="8" />
    <circle cx="20" cy="20" r="20" />
    <rect x="50" y="32" rx="3" ry="3" width="361" height="8" />
    <rect x="50" y="44" rx="3" ry="3" width="361" height="8" />
    <rect x="50" y="56" rx="3" ry="3" width="361" height="8" />
  </ContentLoader>
);

export default CommunityCardLoading;
