import { Pie, PieChart, Cell, Legend } from "recharts"
import {
  Card,
  CardContent,
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

interface CostChartsProps {
  closing_costs: string
  operating_reserve: string
  upfront_fees: string
}

const getChartData = (closing_costs: string, operating_reserve: string, upfront_fees: string) => {
  const closingCostsNumber = parseFloat(closing_costs)
  const operatingReserveNumber = parseFloat(operating_reserve)
  const upfrontFeesNumber = parseFloat(upfront_fees)

  return [
    { name: "Closing Costs", value: closingCostsNumber, fill: "#FF6F61" }, // Coral
    { name: "Operating Reserve", value: operatingReserveNumber, fill: "#6B5B95" }, // Azul oscuro
    { name: "Upfront Fees", value: upfrontFeesNumber, fill: "#88B04B" }, // Verde lima
  ]
}

// Configuración del gráfico
const getChartConfig = (): ChartConfig => ({
  "Closing Costs": {
    label: "Closing Costs",
    color: "hsl(var(--chart-1))",
  },
  "Operating Reserve": {
    label: "Operating Reserve",
    color: "hsl(var(--chart-2))",
  },
  "Upfront Fees": {
    label: "Upfront Fees",
    color: "hsl(var(--chart-3))",
  },
})

export const CostCharts = ({
  closing_costs,
  operating_reserve,
  upfront_fees,
}: CostChartsProps) => {
  const chartData = getChartData(closing_costs, operating_reserve, upfront_fees)
  const chartConfig = getChartConfig()

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cost and Fees Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart width={400} height={300}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label
              nameKey="name"
              outerRadius="80%"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={14}
              wrapperStyle={{ paddingLeft: 20 }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total cost and expenses of the property distributed among percentages.
        </div>
      </CardFooter>
    </Card>
  )
}
