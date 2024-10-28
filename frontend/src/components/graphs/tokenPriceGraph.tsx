"use client"

import { FC } from "react"
import { CartesianGrid, Area, AreaChart, XAxis } from "recharts"
import { FormatCurrency } from "../currencyConverter"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip
} from "@/components/ui/chart"

interface ChartData {
  month: string
  desktop: number
}

interface TokenPriceGraphProps {
  tokenPrice: number
}

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

  // Corregido el tipo de las propiedades de las opciones
  const options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: false, // Cambia a false para el formato de 24 horas
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };

  const formattedTime = timeNow.toLocaleString('en-GB', options);

  return (
    <Card style={{ boxShadow: "0px 0px 13px 0px #00000014" }}>
      <CardHeader>
        <span className="flex justify-between">
          <span className="text-xs text-gray-500">Token Price</span>
          <span className="text-xs text-gray-500">Past Month</span>
        </span>
        <h3 className="text-[36px] font-bold text-black"><FormatCurrency amount={tokenPrice}/></h3>
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="desktop"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-xs  text-muted-foreground">
          Last updated: {formattedTime}
        </div>
      </CardFooter>
    </Card>
  )
}
