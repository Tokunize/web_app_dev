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

export const description = "A mixed bar chart"

const chartData = [
  { browser: "chrome", risk: 3.5, fill: "var(--color-chrome)" },
  { browser: "safari", risk: 1.4, fill: "var(--color-safari)" },
  { browser: "chrome", risk: 2.5, fill: "var(--color-chrome)" },
  { browser: "safari", risk: 2.4, fill: "var(--color-safari)" },
  { browser: "chrome", risk: 3.0, fill: "var(--color-chrome)" },
]

const chartConfig = {
  risk: {
    label: "Risk",
  },
  chrome: {
    label: "Mansion House",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Apartment",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "House",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export const RiskOverview = () => {
  return (
    <Card className="w-full"> {/* Ajustar el tamaño del Card */}
      <CardHeader>
        <CardTitle>Risk Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            barSize={30}
            barGap={0}
            margin={{
              left: 50, // Aumentar el margen para dar más espacio a las etiquetas
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={15} // Aumentar el tickMargin
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="risk" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="risk" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
