"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartData = [
    { month: "January", properties: 50 },
    { month: "February", properties: 75 },
    { month: "March", properties: 60 },
    { month: "April", properties: 30 },
    { month: "May", properties: 90 },
    { month: "June", properties: 45 },
    { month: "July", properties: 80 },
    { month: "August", properties: 40 },
    { month: "September", properties: 70 },
    { month: "October", properties: 55 },
    { month: "November", properties: 65 },
    { month: "December", properties: 25 },
];

const chartConfig = {
  properties: {
    label: "Properties",
    color: "#667085",
  },
} satisfies ChartConfig

export const NewPropertiesGraph =() => {
  return (
    <Card className="w-[90%] sm:w-full">
      <CardHeader>
        <CardTitle className="text-lg  text-gray-500">New Property Listed</CardTitle>
        <CardDescription>Total <span className="font-bold text-black text-lg"> 210 </span>properties</CardDescription>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[350px] w-[90%] mx-auto" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
            height={100} // Ajusta aquí la altura del gráfico
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="properties" fill="#667085" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total properties listed for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
