import React from "react";
import BauhausCard from "@/components/ui/bauhaus-card";

const handleFilledClick = (id: string) => {
  console.log("Filled button clicked:", id);
};
const handleOutlinedClick = (id: string) => {
  console.log("Outlined button clicked:", id);
};
const handleMoreOptionsClick = (id: string) => {
  console.log("More options clicked:", id);
};

export default function BauhausCardDemo() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center gap-10 py-10">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <BauhausCard
          id="card-1"
          borderRadius="2em"
          backgroundColor="#151419"
          separatorColor="#2F2B2A"
          accentColor="#156ef6"
          borderWidth="2px"
          topInscription="Wed, 18 Sep 2024"
          mainText="Modern Performance"
          subMainText="Discover streamlined workflows"
          progressBarInscription="Onboarding"
          progress={65}
          progressValue="65%"
          filledButtonInscription="Start"
          outlinedButtonInscription="Learn More"
          onFilledButtonClick={handleFilledClick}
          onOutlinedButtonClick={handleOutlinedClick}
          onMoreOptionsClick={handleMoreOptionsClick}
          chronicleButtonBg="#fff"
          chronicleButtonFg="#111014"
          chronicleButtonHoverFg="#fff"
        />

        <BauhausCard
          id="card-2"
          borderRadius="2em"
          backgroundColor="#17151e"
          separatorColor="#2F2B2A"
          accentColor="#a594fd"
          borderWidth="2px"
          topInscription="Thu, 19 Sep 2024"
          mainText="Creative Suite"
          subMainText="Visual tools and templates"
          progressBarInscription="Assets"
          progress={30}
          progressValue="30%"
          filledButtonInscription="Create"
          outlinedButtonInscription="Templates"
          onFilledButtonClick={handleFilledClick}
          onOutlinedButtonClick={handleOutlinedClick}
          onMoreOptionsClick={handleMoreOptionsClick}
          chronicleButtonBg="#fff"
          chronicleButtonFg="#111014"
          chronicleButtonHoverFg="#fff"
          ChronicleButtonHoverColor="#a594fd"
        />

        <BauhausCard
          id="card-3"
          borderRadius="2em"
          backgroundColor="#151419"
          separatorColor="#2F2B2A"
          accentColor="#13c18d"
          borderWidth="2px"
          topInscription="Fri, 20 Sep 2024"
          mainText="Analytics Hub"
          subMainText="Trends and insights"
          progressBarInscription="Reports"
          progress={84}
          progressValue="84%"
          filledButtonInscription="View"
          outlinedButtonInscription="Export"
          onFilledButtonClick={handleFilledClick}
          onOutlinedButtonClick={handleOutlinedClick}
          onMoreOptionsClick={handleMoreOptionsClick}
          chronicleButtonBg="#fff"
          chronicleButtonFg="#111014"
          chronicleButtonHoverFg="#fff"
        />

        <BauhausCard
          id="card-4"
          borderRadius="2em"
          backgroundColor="#151419"
          separatorColor="#2F2B2A"
          accentColor="#ff7a61"
          borderWidth="2px"
          topInscription="Sat, 21 Sep 2024"
          mainText="Deploy Center"
          subMainText="Automate releases"
          progressBarInscription="Pipeline"
          progress={55}
          progressValue="55%"
          filledButtonInscription="Deploy"
          outlinedButtonInscription="Logs"
          onFilledButtonClick={handleFilledClick}
          onOutlinedButtonClick={handleOutlinedClick}
          onMoreOptionsClick={handleMoreOptionsClick}
          chronicleButtonBg="#fff"
          chronicleButtonFg="#111014"
          chronicleButtonHoverFg="#fff"
          swapButtons={true}
        />
      </div>
    </div>
  );
}