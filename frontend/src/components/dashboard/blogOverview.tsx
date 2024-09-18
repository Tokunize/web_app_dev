import { Overview } from "./overviewDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { SubscribersTableList } from "../blog/subscribersTablelist";

interface BlogVisits {
  dates: string[];
  visits: number[];
}

interface AnalysisData {
  total_articles: number;
  total_subscribers: number;
  subscriber_emails: string[];
}

export const BlogOverview = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [articlesAmount, setArticlesAmount] = useState<number | undefined>(undefined);
  const [analysisData, setAnalysisData] = useState<AnalysisData | undefined>(undefined);
  const [blogVisits, setBlogVisits] = useState<BlogVisits>({ dates: [], visits: [] });

  const getInvestmentSummary = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/stats/`;

    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(apiUrl, config);
      setAnalysisData(response.data);
      setBlogVisits(response.data.visit_data);
      setArticlesAmount(response.data.total_articles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvestmentSummary();
  }, [getAccessTokenSilently]);

  return (
    <section className="flex-1 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <Card className="callout-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles Posted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articlesAmount ?? "Loading..."}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total visits on the blog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogVisits.visits.reduce((a, b) => a + b, 0)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total blog subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysisData?.total_subscribers ?? "Loading..."}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
        <Overview data={blogVisits} />
        <Card>
          <SubscribersTableList subscribers={analysisData?.subscriber_emails || []} />
        </Card>
      </div>
    </section>
  );
};
