import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

const timeData = {
  "countdown": {
    title: "Countdown Calculators",
    description: "Count down to special dates, holidays, and important events",
    calculators: [
      { key: "birthday-countdown", name: "Birthday Countdown Calculator", description: "Count down to your next birthday" },
      { key: "countdown-timer", name: "Countdown Timer", description: "Custom countdown to any date and time" },
      { key: "days-until", name: "Days Until Calculator", description: "Calculate days until any date" },
      { key: "wedding-countdown", name: "Wedding Countdown Calculator", description: "Count down to your wedding day" },
      { key: "school-end-countdown", name: "End of School Countdown Calculator", description: "Days until school ends" },
      { key: "school-start-countdown", name: "Start of School Countdown Calculator", description: "Days until school starts" },
      { key: "christmas-countdown", name: "How Many Days Until Christmas", description: "Count down to Christmas Day" },
      { key: "new-year-countdown", name: "How Many Days Until New Year's", description: "Count down to New Year's Day" },
      { key: "halloween-countdown", name: "How Many Days Until Halloween", description: "Count down to Halloween" },
      { key: "july-4th-countdown", name: "How Many Days Until July 4th", description: "Count down to Independence Day" },
      { key: "thanksgiving-countdown", name: "How Many Days Until Thanksgiving", description: "Count down to Thanksgiving" },
      { key: "easter-countdown", name: "How Many Days Until Easter", description: "Count down to Easter Sunday" }
    ]
  },
  "time-conversion": {
    title: "Time Conversion Calculators",
    description: "Convert between different time formats and units",
    calculators: [
      { key: "24-to-12-hour", name: "24-Hour to 12-Hour Time Converter", description: "Convert 24-hour to 12-hour format" },
      { key: "military-time", name: "Military Time Converter", description: "Convert military time to standard time" },
      { key: "decimal-to-time", name: "Decimal Hours to HH:MM:SS Time Calculator", description: "Convert decimal hours to time format" },
      { key: "minutes-to-time", name: "Minutes to HH:MM:SS Time Calculator", description: "Convert minutes to time format" },
      { key: "seconds-to-time", name: "Seconds to HH:MM:SS Time Calculator", description: "Convert seconds to time format" },
      { key: "time-to-decimal", name: "Time to Decimal Calculator", description: "Convert time to decimal hours" }
    ]
  },
  "date-time": {
    title: "Time & Date Calculators",
    description: "Calculate ages, dates, durations, and time differences",
    calculators: [
      { key: "age", name: "Age Calculator", description: "Calculate age from birth date" },
      { key: "age-difference", name: "Age Difference Calculator", description: "Calculate age difference between two people" },
      { key: "date-calculator", name: "Date Calculator", description: "Add or subtract days from a date" },
      { key: "date-range", name: "Date Range Calculator", description: "Calculate days between date ranges" },
      { key: "day-counter", name: "Day Counter", description: "Count days between two dates" },
      { key: "day-of-week", name: "Day of the Week Calculator", description: "Find what day of the week a date falls on" },
      { key: "days-from-today", name: "Days From Today Calculator", description: "Calculate future or past dates" },
      { key: "days-since", name: "Days Since Date Calculator", description: "Days elapsed since a specific date" },
      { key: "business-day", name: "Business Day Calculator", description: "Calculate business days between dates" },
      { key: "time-calculator", name: "Time Calculator", description: "Add and subtract time values" },
      { key: "time-duration", name: "Time Duration Calculator", description: "Calculate duration between times" },
      { key: "time-card", name: "Time Card Calculator", description: "Calculate work hours and overtime" },
      { key: "work-time", name: "Work Time Calculator", description: "Calculate work time and breaks" },
      { key: "hours-calculator", name: "Hours Calculator", description: "Calculate hours between times" },
      { key: "weeks-between", name: "Weeks Between Dates Calculator", description: "Calculate weeks between two dates" },
      { key: "years-between", name: "Years Between Dates Calculator", description: "Calculate years between two dates" },
      { key: "years-ago", name: "Years Ago Calculator", description: "Calculate what date was X years ago" }
    ]
  },
  "knowledge-base": {
    title: "Knowledge Base",
    description: "Calendar information and date resources",
    calculators: [
      { key: "2025-calendar", name: "2025 Calendar", description: "View the complete 2025 calendar" },
      { key: "2026-calendar", name: "2026 Calendar", description: "View the complete 2026 calendar" },
      { key: "day-of-year", name: "What Day of the Year Is It", description: "Find the current day number of the year" },
      { key: "week-of-year", name: "What Week of the Year Is It", description: "Find the current week number" },
      { key: "todays-date", name: "What Is Today's Date", description: "Display today's date in various formats" },
      { key: "weeks-left-2025", name: "How Many Weeks Are Left in 2025", description: "Weeks remaining in the current year" },
      { key: "days-left-2025", name: "How Many Days Are Left in 2025", description: "Days remaining in the current year" }
    ]
  }
};

export default function TimeCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="time"
      description="Calculate ages, dates, countdowns, and time durations."
      canonical="https://www.smartkitnow.com/time"
      titleOverride={undefined}
      breadcrumbsOverride={undefined}
      marginTopClass="mt-[156px] md:mt-[176px]"
      showRightRail={true}
      showTopBanner={true}
      showBottomBanner={true}
      railsSticky={false}
      backTo="/"
    />
  );
}