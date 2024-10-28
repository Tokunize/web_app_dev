"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis,Legend } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse()

const chartData = years.map(year => ({
  year,
  Flat: Math.floor(Math.random() * 10000000), // Replace with actual data
  Houses: Math.floor(Math.random() * 10000000)  // Replace with actual data
}))

// #C8E870
// #82A621
const chartConfig = {
  Flats: {
    label: "Flats",
    color: "#C8E870",
  },
  Houses: {
    label: "Houses",
    color: "#82A621",
  },
} satisfies ChartConfig

export const HistoricalPrice = () =>{
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
          tickFormatter={(value) => `${Math.round(value / 1000)}k`} // Redondeamos y eliminamos decimales
          orientation="left"
          tickLine={false}
          axisLine={false}
          domain={[300000, 1000000]}  // Domain range from 200k to 1 million
          tickCount={5} // Number of ticks to display
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend 
          align="right"
          verticalAlign="bottom"
         // Align legend at the top
          height={26}
          />
        <Bar dataKey="Flat" fill="var(--color-Flats)" radius={4} />
        <Bar dataKey="Houses" fill="var(--color-Houses)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
