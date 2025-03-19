"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@heroui/react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllPoints } from "../components/pointsStorage"
import TopMenu from "../components/TopMenu"


const Page = () => {

  const datesList = getAllPoints()

  const [chartData, setChartData] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [hourlyChartData, setHourlyChartData] = useState([])
  const [timeRange, setTimeRange] = useState("month") // Default to "month"
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // Process data for the chart based on selected time range
    updateChartData()
  }, [timeRange, currentDate])

  // Update chart data based on time range
  const updateChartData = () => {
    let startDate, endDate

    if (timeRange === "week") {
      // Get the start and end of the current week
      startDate = getStartOfWeek(currentDate)
      endDate = getEndOfWeek(currentDate)
    } else {
      // Get the start and end of the current month
      startDate = getStartOfMonth(currentDate)
      endDate = getEndOfMonth(currentDate)
    }

    // Format dates to YYYY-MM-DD for comparison
    const startDateStr = formatDateToYYYYMMDD(startDate)
    const endDateStr = formatDateToYYYYMMDD(endDate)

    // Filter dates based on time range
    const filteredDates = datesList.filter((date) => {
      const dateStr = date.split("T")[0]
      return dateStr >= startDateStr && dateStr <= endDateStr
    })

    // Process filtered data
    const processedData = processDataForChart(filteredDates)

    // Add missing dates with zero count
    const filledData = fillMissingDates(processedData, startDate, endDate)

    setChartData(filledData)
  }

  // Get the start of the week (Sunday)
  const getStartOfWeek = (date) => {
    const result = new Date(date)
    const day = result.getDay() // 0 = Sunday, 1 = Monday, etc.
    result.setDate(result.getDate() - day) // Go back to Sunday
    result.setHours(0, 0, 0, 0) // Set to beginning of day
    return result
  }

  // Get the end of the week (Saturday)
  const getEndOfWeek = (date) => {
    const result = new Date(date)
    const day = result.getDay() // 0 = Sunday, 1 = Monday, etc.
    result.setDate(result.getDate() + (6 - day)) // Go forward to Saturday
    result.setHours(23, 59, 59, 999) // Set to end of day
    return result
  }

  // Get the start of the month
  const getStartOfMonth = (date) => {
    const result = new Date(date)
    result.setDate(1) // First day of month
    result.setHours(0, 0, 0, 0) // Set to beginning of day
    return result
  }

  // Get the end of the month
  const getEndOfMonth = (date) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1) // Go to next month
    result.setDate(0) // Last day of previous month
    result.setHours(23, 59, 59, 999) // Set to end of day
    return result
  }

  // Format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Fill in missing dates with zero count
  const fillMissingDates = (data, startDate, endDate) => {
    const dateMap = {}

    // Create a map of existing dates
    data.forEach((item) => {
      dateMap[item.day] = item.count
    })

    const result = []
    const currentDate = new Date(startDate)

    // Loop through each day in the range
    while (currentDate <= endDate) {
      const dateStr = formatDateToYYYYMMDD(currentDate)

      // Add the date with its count (or 0 if it doesn't exist)
      result.push({
        day: dateStr,
        count: dateMap[dateStr] || 0,
      })

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  // Function to process data for the daily chart
  const processDataForChart = (dateStrings) => {
    // Create a map to count occurrences of each day
    const dayCountMap = {}

    // Count occurrences of each day
    dateStrings.forEach((dateString) => {
      // Extract just the date part (YYYY-MM-DD)
      const day = dateString.split("T")[0]

      if (dayCountMap[day]) {
        dayCountMap[day]++
      } else {
        dayCountMap[day] = 1
      }
    })

    // Convert the map to an array of objects for the chart
    return Object.keys(dayCountMap).map((day) => ({
      day,
      count: dayCountMap[day],
    }))
  }

  // Function to process hourly data for a specific day
  const processHourlyData = (day) => {
    // Filter dates for the selected day
    const dayData = datesList.filter((date) => date.startsWith(day))

    // Create a map to count occurrences of each hour
    const hourCountMap = {}

    // Count occurrences of each hour
    dayData.forEach((dateString) => {
      // Extract the hour part
      const hour = dateString.split("T")[1]

      if (hourCountMap[hour]) {
        hourCountMap[hour]++
      } else {
        hourCountMap[hour] = 1
      }
    })

    // Convert the map to an array of objects for the chart
    // Only include hours with data (count > 0)
    return Object.keys(hourCountMap)
      .map((hour) => ({
        hour: Number.parseInt(hour),
        count: hourCountMap[hour],
      }))
      .sort((a, b) => a.hour - b.hour) // Sort by hour
  }

  // Handle bar click to show hourly breakdown
  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedDay = data.activePayload[0].payload.day
      setSelectedDay(clickedDay)

      // Process hourly data for the selected day
      const hourlyData = processHourlyData(clickedDay)
      setHourlyChartData(hourlyData)
    }
  }

  // Go back to daily view
  const handleBackClick = () => {
    setSelectedDay(null)
  }

  // Handle time range change
  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  // Navigate to previous period (week or month)
  const handlePrevious = () => {
    const newDate = new Date(currentDate)

    if (timeRange === "week") {
      // Go back one week
      newDate.setDate(newDate.getDate() - 7)
    } else {
      // Go back one month
      newDate.setMonth(newDate.getMonth() - 1)
    }

    setCurrentDate(newDate)
  }

  // Navigate to next period (week or month)
  const handleNext = () => {
    const newDate = new Date(currentDate)
    const today = new Date()

    if (timeRange === "week") {
      // Go forward one week
      newDate.setDate(newDate.getDate() + 7)
    } else {
      // Go forward one month
      newDate.setMonth(newDate.getMonth() + 1)
    }

    // Don't allow navigating into the future
    if (newDate > today) {
      newDate.setTime(today.getTime())
    }

    setCurrentDate(newDate)
  }

  // Format date range for display
  const formatDateRange = () => {
    let startDate, endDate

    if (timeRange === "week") {
      startDate = getStartOfWeek(currentDate)
      endDate = getEndOfWeek(currentDate)
    } else {
      startDate = getStartOfMonth(currentDate)
      endDate = getEndOfMonth(currentDate)
    }

    const startMonth = startDate.toLocaleString("default", { month: "short" })
    const endMonth = endDate.toLocaleString("default", { month: "short" })

    if (startDate.getFullYear() !== endDate.getFullYear()) {
      return `${startMonth} ${startDate.getDate()}, ${startDate.getFullYear()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`
    } else if (startMonth !== endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`
    } else {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${endDate.getFullYear()}`
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div >
     <TopMenu/>

    <div className="space-y-6 p-4">
      {selectedDay ? (
        // Hourly breakdown view
        <>
          
          <div className=" mx-[150px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBackClick} className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Days
              </Button>
              {/* <h2 className="text-2xl font-bold">Hourly Breakdown for {formatDate(selectedDay)}</h2> */}
            </div>
          </div>
            <ChartContainer
              config={{
                count: {
                  label: "",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    // Format to show hour with AM/PM
                    tickFormatter={(value) => {
                      return `${value}:00`
                    }}
                  />
                  <YAxis tickLine={false} axisLine={true} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} name="Points" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </>
      ) : (
        // Daily view
        <>
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Completed Tasks</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 text-sm font-medium">{formatDateRange()}</div>
                <Button variant="outline" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="m-[150px]">
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    // Format to show shorter date
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}`
                    }}
                  />
                  <YAxis tickLine={false} axisLine={true} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                    name="Count"
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            {/* <p className="text-center text-sm text-muted-foreground mt-2">Click on a bar to see hourly breakdown</p> */}
            </div>
        </>
      )}
    </div>
    </div>
  )
}

export default Page

