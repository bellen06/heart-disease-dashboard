"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Heart3D from "@/components/heart-3d"
import HeartMonitor from "@/components/heart-monitor"
import PatientList from "@/components/patient-list"
import DecisionSupport from "@/components/decision-support"
import AnalyticsCharts from "@/components/analytics-charts"
import { Activity, Heart, Users, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"

export default function HeartDiseaseDashboard() {
  const [selectedPatient, setSelectedPatient] = useState("patient-1")
  const [patients, setPatients] = useState([
    {
      id: "patient-1",
      name: "John Smith",
      age: 65,
      gender: "male" as const,
      risk: "high" as const,
      heartRate: 85,
      bloodPressure: "140/90",
      lastVisit: "2024-01-15",
    },
    {
      id: "patient-2",
      name: "Sarah Johnson",
      age: 52,
      gender: "female" as const,
      risk: "medium" as const,
      heartRate: 72,
      bloodPressure: "130/85",
      lastVisit: "2024-01-12",
    },
    {
      id: "patient-3",
      name: "Michael Brown",
      age: 43,
      gender: "male" as const,
      risk: "low" as const,
      heartRate: 68,
      bloodPressure: "120/80",
      lastVisit: "2024-01-10",
    },
  ])

  const currentPatient = patients.find((p) => p.id === selectedPatient) || patients[0]

  // Sample patient data for decision support
  const currentPatientData = {
    age: currentPatient.age,
    gender: currentPatient.gender,
    bloodPressureSystolic: Number.parseInt(currentPatient.bloodPressure.split("/")[0]),
    bloodPressureDiastolic: Number.parseInt(currentPatient.bloodPressure.split("/")[1]),
    cholesterolTotal: currentPatient.risk === "high" ? 250 : currentPatient.risk === "medium" ? 220 : 180,
    cholesterolHDL: currentPatient.risk === "high" ? 35 : currentPatient.risk === "medium" ? 45 : 55,
    cholesterolLDL: currentPatient.risk === "high" ? 160 : currentPatient.risk === "medium" ? 130 : 100,
    bmi: currentPatient.risk === "high" ? 32 : currentPatient.risk === "medium" ? 28 : 24,
    smokingStatus: currentPatient.risk === "high",
    diabetesStatus: currentPatient.risk === "high",
    familyHistory: currentPatient.risk !== "low",
    physicalActivity: currentPatient.risk === "high" ? ("low" as const) : ("moderate" as const),
  }

  const riskFactors = [
    {
      name: "Age",
      value: currentPatient.age,
      risk: currentPatient.age > 65 ? "high" : currentPatient.age > 45 ? "medium" : "low",
      weight: 0.2,
    },
    { name: "Blood Pressure", value: currentPatient.bloodPressure, risk: currentPatient.risk, weight: 0.25 },
    { name: "Cholesterol", value: currentPatientData.cholesterolTotal, risk: currentPatient.risk, weight: 0.2 },
    { name: "BMI", value: currentPatientData.bmi, risk: currentPatient.risk, weight: 0.15 },
    {
      name: "Smoking",
      value: currentPatientData.smokingStatus ? "Yes" : "No",
      risk: currentPatientData.smokingStatus ? "high" : "low",
      weight: 0.2,
    },
  ]

  const getRiskScore = () => {
    return riskFactors.reduce((acc, factor) => {
      const riskValue = factor.risk === "high" ? 3 : factor.risk === "medium" ? 2 : 1
      return acc + riskValue * factor.weight * 100
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground text-balance">Heart Disease Decision Support System</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Advanced diagnostic assistance for cardiovascular health assessment
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="pulse-glow">
              <Activity className="w-4 h-4 mr-2" />
              Live Monitoring
            </Badge>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="decision-support">Decision Support</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 3D Heart Visualization */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      3D Heart Analysis
                    </CardTitle>
                    <CardDescription>Interactive cardiovascular risk visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Heart3D
                      riskLevel={currentPatient.risk as "low" | "medium" | "high"}
                      isBeating={true}
                      showRiskLabel={true}
                      className="w-full h-80"
                    />
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-2xl font-bold text-primary">{Math.round(getRiskScore())}%</span>
                      </div>
                      <Progress value={getRiskScore()} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Patient Data & Monitoring */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Current Patient
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {patients.map((patient) => (
                        <Button
                          key={patient.id}
                          variant={selectedPatient === patient.id ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start"
                          onClick={() => setSelectedPatient(patient.id)}
                        >
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-sm opacity-70">Age: {patient.age}</div>
                          <Badge
                            variant={
                              patient.risk === "high"
                                ? "destructive"
                                : patient.risk === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="mt-2"
                          >
                            {patient.risk.toUpperCase()} RISK
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Heart Monitor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary heartbeat" />
                      Real-time ECG Monitor
                    </CardTitle>
                    <CardDescription>Live cardiovascular monitoring for {currentPatient.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HeartMonitor heartRate={currentPatient.heartRate} className="w-full h-32" />
                  </CardContent>
                </Card>

                {/* Risk Factors Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Risk Factors Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-3">
                            {factor.risk === "high" ? (
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                            ) : factor.risk === "medium" ? (
                              <Activity className="w-5 h-5 text-primary" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            <div>
                              <div className="font-medium">{factor.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Value: {factor.value} | Weight: {(factor.weight * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              factor.risk === "high"
                                ? "destructive"
                                : factor.risk === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {factor.risk.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <PatientList
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onUpdatePatients={setPatients}
            />
          </TabsContent>

          <TabsContent value="decision-support" className="mt-6">
            <DecisionSupport patientData={currentPatientData} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              </div>
              <AnalyticsCharts />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
