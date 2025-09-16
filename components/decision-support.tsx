"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertTriangle, CheckCircle, Clock, Stethoscope, Pill, Activity, Users, TrendingUp } from "lucide-react"
import {
  assessCardiovascularRisk,
  getAHAACCRiskCategory,
  type PatientData,
  type RiskAssessment,
} from "@/lib/risk-calculator"

interface DecisionSupportProps {
  patientData: PatientData
  className?: string
}

export default function DecisionSupport({ patientData, className = "" }: DecisionSupportProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const calculateRisk = async () => {
      setIsCalculating(true)
      // Simulate calculation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const result = assessCardiovascularRisk(patientData)
      setAssessment(result)
      setIsCalculating(false)
    }

    calculateRisk()
  }, [patientData])

  if (isCalculating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            Decision Support System
          </CardTitle>
          <CardDescription>Analyzing cardiovascular risk factors...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Calculating risk assessment...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!assessment) return null

  const riskCategory = getAHAACCRiskCategory(assessment.tenYearRisk)

  const getUrgencyIcon = () => {
    switch (assessment.urgencyLevel) {
      case "immediate":
        return <AlertTriangle className="w-5 h-5 text-destructive" />
      case "urgent":
        return <Clock className="w-5 h-5 text-primary" />
      case "routine":
        return <CheckCircle className="w-5 h-5 text-green-600" />
    }
  }

  const getUrgencyColor = () => {
    switch (assessment.urgencyLevel) {
      case "immediate":
        return "destructive"
      case "urgent":
        return "default"
      case "routine":
        return "secondary"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Decision Support System
        </CardTitle>
        <CardDescription>Evidence-based cardiovascular risk assessment and recommendations</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{Math.round(assessment.riskScore)}%</div>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                <Badge
                  variant={
                    assessment.overallRisk === "high"
                      ? "destructive"
                      : assessment.overallRisk === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {assessment.overallRisk.toUpperCase()} RISK
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{Math.round(assessment.tenYearRisk)}%</div>
                <p className="text-sm text-muted-foreground">10-Year ASCVD Risk</p>
                <Badge variant={riskCategory.color as any}>{riskCategory.category}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center">{getUrgencyIcon()}</div>
                <p className="text-sm text-muted-foreground">Urgency Level</p>
                <Badge variant={getUrgencyColor() as any}>{assessment.urgencyLevel.toUpperCase()}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgency Alert */}
        {assessment.urgencyLevel === "immediate" && (
          <Alert className="mb-6 border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              <strong>Immediate Action Required:</strong> This patient requires urgent cardiovascular evaluation and
              intervention. Consider emergency cardiology consultation.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Treatment Recommendations</h3>

              {/* Group recommendations by category */}
              {["medication", "lifestyle", "monitoring", "referral"].map((category) => {
                const categoryRecs = assessment.recommendations.filter((r) => r.category === category)
                if (categoryRecs.length === 0) return null

                const categoryIcons = {
                  medication: <Pill className="w-5 h-5" />,
                  lifestyle: <Activity className="w-5 h-5" />,
                  monitoring: <Stethoscope className="w-5 h-5" />,
                  referral: <Users className="w-5 h-5" />,
                }

                return (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {category.charAt(0).toUpperCase() + category.slice(1)} Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {categoryRecs.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="mt-1"
                          >
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Timeframe: {rec.timeframe}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="risk-factors" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Factor Analysis</h3>

              <div className="space-y-3">
                {assessment.riskFactors.map((factor, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            factor.risk === "high" ? "destructive" : factor.risk === "medium" ? "default" : "secondary"
                          }
                        >
                          {factor.risk.toUpperCase()}
                        </Badge>
                        <h4 className="font-medium">{factor.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{factor.value}</div>
                        {factor.normalRange && (
                          <div className="text-xs text-muted-foreground">Normal: {factor.normalRange}</div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{factor.description}</p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Weight:</span>
                      <Progress value={factor.weight * 100} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">{(factor.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guidelines" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Clinical Guidelines</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AHA/ACC Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Risk Category:</span>
                      <Badge variant={riskCategory.color as any}>{riskCategory.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{riskCategory.description}</p>

                    <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                      <h4 className="font-medium mb-2">Guideline Recommendations:</h4>
                      <ul className="text-sm space-y-1">
                        {assessment.tenYearRisk >= 20 && (
                          <>
                            <li>• High-intensity statin therapy recommended</li>
                            <li>• Consider PCSK9 inhibitor if LDL &gt;70 mg/dL on statin</li>
                            <li>• Blood pressure target &lt;130/80 mmHg</li>
                          </>
                        )}
                        {assessment.tenYearRisk >= 7.5 && assessment.tenYearRisk < 20 && (
                          <>
                            <li>• Moderate to high-intensity statin therapy</li>
                            <li>• Consider coronary artery calcium scoring</li>
                            <li>• Lifestyle modifications emphasized</li>
                          </>
                        )}
                        {assessment.tenYearRisk < 7.5 && (
                          <>
                            <li>• Focus on lifestyle modifications</li>
                            <li>• Statin therapy may be considered with risk enhancers</li>
                            <li>• Regular monitoring and reassessment</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
