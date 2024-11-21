

"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
  { month: "January", Tokunize: 6.0, SP500: 4.5 },
  { month: "February", Tokunize: 7.5, SP500: 6.0 },
  { month: "March", Tokunize: 8.0, SP500: 5.0 },
  { month: "April", Tokunize: 5.0, SP500: 6.5 },
  { month: "May", Tokunize: 6.8, SP500: 5.5 },
  { month: "June", Tokunize: 7.0, SP500: 5.8 },
];


const chartConfig = {
  Tokunize: {
    label: "Tokunize",
    color: "hsl(var(--chart-1))",
  },
  SP500: {
    label: "SP&500",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export const  PerformanceGraph =() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Analysis Chart</CardTitle>
        <CardDescription>
          Showing a comparative between Tokunize and S&P 500 in the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillTokunize" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Tokunize)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Tokunize)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSP500" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-SP500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-SP500)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="SP500"
              type="natural"
              fill="url(#fillSP500)"
              fillOpacity={0.4}
              stroke="var(--color-SP500)"
              stackId="a"
            />
            <Area
              dataKey="Tokunize"
              type="natural"
              fill="url(#fillTokunize)"
              fillOpacity={0.4}
              stroke="var(--color-Tokunize)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
          
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
