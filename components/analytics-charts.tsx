"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity, Users } from "lucide-react"

// Sample data for charts
const riskDistributionData = [
  { name: "Low Risk", value: 45, count: 23, color: "#43aa8b" },
  { name: "Medium Risk", value: 35, count: 18, color: "#f9c74f" },
  { name: "High Risk", value: 20, count: 10, color: "#e63946" },
]

const monthlyTrendsData = [
  { month: "Jan", lowRisk: 20, mediumRisk: 15, highRisk: 8, total: 43 },
  { month: "Feb", lowRisk: 22, mediumRisk: 16, highRisk: 9, total: 47 },
  { month: "Mar", lowRisk: 25, mediumRisk: 18, highRisk: 7, total: 50 },
  { month: "Apr", lowRisk: 23, mediumRisk: 17, highRisk: 10, total: 50 },
  { month: "May", lowRisk: 26, mediumRisk: 19, highRisk: 8, total: 53 },
  { month: "Jun", lowRisk: 23, mediumRisk: 18, highRisk: 10, total: 51 },
]

const riskFactorAnalysis = [
  { factor: "Age", score: 85, fullMark: 100 },
  { factor: "Blood Pressure", score: 75, fullMark: 100 },
  { factor: "Cholesterol", score: 65, fullMark: 100 },
  { factor: "BMI", score: 70, fullMark: 100 },
  { factor: "Smoking", score: 90, fullMark: 100 },
  { factor: "Diabetes", score: 80, fullMark: 100 },
]

const outcomeData = [
  { month: "Jan", prevented: 12, improved: 8, stable: 15 },
  { month: "Feb", prevented: 15, improved: 10, stable: 18 },
  { month: "Mar", prevented: 18, improved: 12, stable: 20 },
  { month: "Apr", prevented: 16, improved: 14, stable: 22 },
  { month: "May", prevented: 20, improved: 16, stable: 25 },
  { month: "Jun", prevented: 22, improved: 18, stable: 28 },
]

const interventionEffectiveness = [
  { intervention: "Statin Therapy", success: 85, total: 100 },
  { intervention: "ACE Inhibitors", success: 78, total: 90 },
  { intervention: "Lifestyle Changes", success: 65, total: 120 },
  { intervention: "Smoking Cessation", success: 72, total: 85 },
  { intervention: "Weight Management", success: 58, total: 95 },
]

interface AnalyticsChartsProps {
  className?: string
}

export default function AnalyticsCharts({ className = "" }: AnalyticsChartsProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold text-primary">51</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-3xl font-bold text-destructive">10</p>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">19.6% of total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interventions</p>
                <p className="text-3xl font-bold text-primary">127</p>
              </div>
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15% success rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                <p className="text-3xl font-bold text-primary">68%</p>
              </div>
              <PieChartIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">-5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Current patient risk level distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Risk Trends
            </CardTitle>
            <CardDescription>Patient risk levels over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip content={CustomTooltip} />
                  <Area
                    type="monotone"
                    dataKey="highRisk"
                    stackId="1"
                    stroke="#e63946"
                    fill="#e63946"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="mediumRisk"
                    stackId="1"
                    stroke="#f9c74f"
                    fill="#f9c74f"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="lowRisk"
                    stackId="1"
                    stroke="#43aa8b"
                    fill="#43aa8b"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factor Analysis Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Risk Factor Analysis
            </CardTitle>
            <CardDescription>Average risk factor scores across patient population</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskFactorAnalysis}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis dataKey="factor" className="text-muted-foreground" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-muted-foreground" />
                  <Radar
                    name="Risk Score"
                    dataKey="score"
                    stroke="#f9c74f"
                    fill="#f9c74f"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip content={CustomTooltip} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Intervention Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Intervention Effectiveness
            </CardTitle>
            <CardDescription>Success rates of different treatment interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionEffectiveness} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} className="text-muted-foreground" />
                  <YAxis dataKey="intervention" type="category" width={120} className="text-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-green-600">
                              Success: {data.success}/{data.total} ({Math.round((data.success / data.total) * 100)}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="success" fill="#43aa8b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Outcomes Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Patient Outcomes Timeline
          </CardTitle>
          <CardDescription>Monthly tracking of patient outcome improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={CustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  stroke="#43aa8b"
                  strokeWidth={3}
                  dot={{ fill: "#43aa8b", strokeWidth: 2, r: 6 }}
                  name="Events Prevented"
                />
                <Line
                  type="monotone"
                  dataKey="improved"
                  stroke="#f9c74f"
                  strokeWidth={3}
                  dot={{ fill: "#f9c74f", strokeWidth: 2, r: 6 }}
                  name="Risk Improved"
                />
                <Line
                  type="monotone"
                  dataKey="stable"
                  stroke="#4b5563"
                  strokeWidth={3}
                  dot={{ fill: "#4b5563", strokeWidth: 2, r: 6 }}
                  name="Stable Condition"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#43aa8b]" />
              <span className="text-sm">Events Prevented</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f9c74f]" />
              <span className="text-sm">Risk Improved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4b5563]" />
              <span className="text-sm">Stable Condition</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
