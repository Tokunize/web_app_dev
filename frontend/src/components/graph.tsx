"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

const chartData = years.map(year => ({
  year,
  desktop: Math.floor(Math.random() * 1000000), // Replace with actual data
  mobile: Math.floor(Math.random() * 1000000)  // Replace with actual data
}))

const chartConfig = {
  desktop: {
    label: "Flats",
    color: "#C8E870",
  },
  mobile: {
    label: "Houses",
    color: "#82A621",
  },
} satisfies ChartConfig

export const Graphic = () =>{
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full py-[40px]">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickFormatter={(value) => `${value / 1000}k`}
          orientation="right"
          tickLine={false}
          axisLine={false}
          domain={[200000, 1000000]}  // Domain range from 200k to 1 million
          tickCount={5} // Number of ticks to display
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
