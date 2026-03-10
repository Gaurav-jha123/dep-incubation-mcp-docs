import TinyBarChart from "./components/TinyBarChart";
import TwoLevelPieChart from "./components/TwoLevelPieChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./Reports.scss";

export default function Reports() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-8">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-700">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-indigo-600 mb-6">View and generate reports here.</p>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">Bar Chart Overview</h2>
              <TinyBarChart />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">Pie Chart Analysis</h2>
              <TwoLevelPieChart isAnimationActive={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}