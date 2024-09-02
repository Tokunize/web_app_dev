"use client"

import { FC } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, Brush, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define the structure of your chart data
interface ChartData {
  month: string
  desktop: number
}

// Define the structure of the props for your component
interface TokenPriceGraphProps {
  tokenPrice: number
}

// Define the configuration structure for the chart
const chartConfig: ChartConfig = {
  desktop: {
    label: "Token Price",
    color: "hsl(var(--chart-1))",
  },
}

export const TokenPriceGraph: FC<TokenPriceGraphProps> = ({ tokenPrice }) => {
  const timeNow = new Date()

  const chartData: ChartData[] = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
    { month: "July", desktop: 204 },
    { month: "August", desktop: 211 },
    // Add more data as needed
  ]

  return (
    <Card style={{ boxShadow: "0px 0px 13px 0px #00000014" }}>
      <CardHeader>
        <CardDescription className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span>Token Price</span>
            <span>Past Month</span>
          </div>
          <h3 className="text-[36px] font-bold text-black">£{tokenPrice}</h3>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={600} 
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              padding={{ left: 20, right: 20 }}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Brush dataKey="month" height={30} stroke="var(--color-desktop)" />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Last updated: {timeNow.toLocaleString()} 
        </div>
      </CardFooter>
    </Card>
  )
}
