

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
import { InformationTool } from "../informationTool";

const chartData = [
  { property: "chrome", risk: 3.5, fill: "var(--color-chrome)" },
  { property: "safari", risk: 3.0, fill: "var(--color-safari)" },
]

const chartConfig = {
  risk: {
    label: "Risk",
  },
  chrome: {
    label: "Luxury Apartments",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Data Center",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export const RiskOverview = () => {
  return (
    <Card>
      <CardHeader>
        <span className=" flex items-center  flex-row space-x-3">
            <CardTitle>Risk Overview</CardTitle>
            <InformationTool message="A Sharpe ratio greater than 1.0 is considered acceptable to good. A ratio higher than 2.0 is rated as very good. A ratio of 3.0 or higher is considered excellent. A ratio under 1.0 is considered sub-optimal."/>
        </span>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="property"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              width={100}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="risk" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="risk" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the risk overview of your investments
        </div>
      </CardFooter>
    </Card>
  )
}
