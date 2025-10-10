import { CategorySection } from "@/components/layouts/CategoryPageTemplate";
 
 export const SMART_TIPS_TITLE = "Smart Tips"; 
 export const SMART_TIPS_DESCRIPTION = 
   "Quick, actionable insights to optimize your daily life. Save time, reduce friction, and make better choices in health, productivity, home, and more."; 
 
 export const SMART_TIPS_SECTIONS: CategorySection[] = [ 
   { 
     heading: "Popular Smart Tips", 
     items: [ 
       { title: "Healthy Habit Builder", to: "/smart-tips/healthy-habits" }, 
       { title: "Focus & Productivity Boosters", to: "/smart-tips/productivity" }, 
       { title: "Home Efficiency Tips", to: "/smart-tips/home-efficiency" }, 
       { title: "Meal Prep Shortcuts", to: "/smart-tips/meal-prep" }, 
       { title: "Study Smarter", to: "/smart-tips/study-smarter" }, 
       { title: "Better Sleep Checklist", to: "/smart-tips/better-sleep" }, 
     ], 
   }, 
   { 
     heading: "New & Trending", 
     items: [ 
       { title: "Habit Streak Planner", to: "/smart-tips/habit-streak" }, 
       { title: "Micro-Goals Method", to: "/smart-tips/micro-goals" }, 
       { title: "Digital Declutter", to: "/smart-tips/digital-declutter" }, 
       { title: "Kitchen Time Savers", to: "/smart-tips/kitchen-savers" }, 
     ], 
   }, 
 ];