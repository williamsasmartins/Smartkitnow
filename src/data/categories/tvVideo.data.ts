import { CategorySection } from "@/components/layouts/CategoryPageTemplate";
 
 export const TVVIDEO_TITLE = "TV & Video Tools"; 
 export const TVVIDEO_DESCRIPTION = 
   "Choose the ideal screen size, distance, and video settings in seconds. Get clean recommendations for TVs, projectors, and content mastering."; 
 
 export const TVVIDEO_SECTIONS: CategorySection[] = [ 
   { 
     heading: "Popular Tools", 
     items: [ 
       { title: "TV Viewing Distance", to: "/tv/viewing-distance" }, 
       { title: "Screen Size Calculator", to: "/tv/screen-size" }, 
       { title: "Video Resolution Guide", to: "/video/resolutions" }, 
       { title: "Projector Throw Distance", to: "/tv/projector" }, 
       { title: "Aspect Ratio Calculator", to: "/video/aspect-ratio" }, 
       { title: "Bitrate & File Size", to: "/video/bitrate" }, 
     ], 
   }, 
   { 
     heading: "Buying Guides", 
     items: [ 
       { title: "TV Mounting Height", to: "/tv/mounting-height" }, 
       { title: "TV Mounting Cost", to: "/tv/mounting-cost" }, 
       { title: "Viewing Ranges Explained", to: "/tv/viewing-ranges" }, 
     ], 
   }, 
 ];