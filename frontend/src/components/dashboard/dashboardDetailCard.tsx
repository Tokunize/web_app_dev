
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    title : string,
    value: number,
}
export const DashboardDetailCard = ({title,value}:Props) =>{
    return(
        <Card className="callout-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
        </Card>
    )
} 
