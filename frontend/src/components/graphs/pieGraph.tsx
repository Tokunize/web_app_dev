"use client"

import { Pie, PieChart } from "recharts"

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

// Define a type for the props
interface PieGraphProps {
  data: { location: string; percentage: number; fill: string }[] 
  title: string,
  footerDescription: string
}

// Function to format the date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  }
} satisfies ChartConfig

const Legend = ({ data }: { data: { location: string; fill: string, percentage:number }[] }) => (
  <div className="flex flex-col">
    {data.map((item) => (
      <div key={item.location} className="flex items-center">
        <div style={{ backgroundColor: item.fill }} className="h-3 rounded-full w-3 mr-2" />
        <span>{item.location}: {item.percentage}%</span>
      </div>
    ))}
  </div>
);

export const PieGraph = ({ data, title,footerDescription }: PieGraphProps) => {
  const description = `Updated: ${formatDate(new Date())}`; // Set the description with the current date
  return (
    <Card className="flex border-0 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription> {/* Use the description here */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="percentage" // Change to "percentage"
              nameKey="location" // Change to "location"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {footerDescription}
        </div>
        <Legend data={data} /> 
      </CardFooter>
    </Card>
  )
}
