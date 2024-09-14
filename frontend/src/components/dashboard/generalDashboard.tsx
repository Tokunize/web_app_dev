import { TableDemo } from "./dashboardTable";
import { Overview } from "./overviewDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export const GeneralDashboard = () =>{
    return(
            <section className="flex-1 bg-gray-100">
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="grid grid-row-2">
                        <Card className="callout-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                Total Revenue
                                </CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-rows-2 gap-4"> {/* Top right small card */}
                        <div>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                    </CardTitle>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                    >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                    </CardTitle>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                    >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <Card className="flex items-center justify-center p-4">
                        <Overview />  
                    </Card>
                    <Card className="p-4">
                        <TableDemo />
                    </Card>
                </div>
            </section>
    )
}