export interface PatientData {
  age: number
  gender: "male" | "female" | "other"
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  cholesterolTotal: number
  cholesterolHDL: number
  cholesterolLDL: number
  bmi: number
  smokingStatus: boolean
  diabetesStatus: boolean
  familyHistory: boolean
  physicalActivity: "low" | "moderate" | "high"
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high"
  riskScore: number
  tenYearRisk: number
  riskFactors: RiskFactor[]
  recommendations: Recommendation[]
  urgencyLevel: "routine" | "urgent" | "immediate"
}

export interface RiskFactor {
  name: string
  value: number | string | boolean
  risk: "low" | "medium" | "high"
  weight: number
  description: string
  normalRange?: string
}

export interface Recommendation {
  category: "medication" | "lifestyle" | "monitoring" | "referral"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  timeframe: string
}

// Framingham Risk Score calculation (simplified version)
export function calculateFraminghamRisk(patient: PatientData): number {
  let points = 0

  // Age points
  if (patient.gender === "male") {
    if (patient.age >= 70) points += 11
    else if (patient.age >= 65) points += 10
    else if (patient.age >= 60) points += 8
    else if (patient.age >= 55) points += 6
    else if (patient.age >= 50) points += 4
    else if (patient.age >= 45) points += 2
    else if (patient.age >= 40) points += 1
  } else {
    if (patient.age >= 70) points += 12
    else if (patient.age >= 65) points += 9
    else if (patient.age >= 60) points += 7
    else if (patient.age >= 55) points += 4
    else if (patient.age >= 50) points += 3
    else if (patient.age >= 45) points += 2
    else if (patient.age >= 40) points += 1
  }

  // Total cholesterol points
  if (patient.cholesterolTotal >= 280) points += 3
  else if (patient.cholesterolTotal >= 240) points += 2
  else if (patient.cholesterolTotal >= 200) points += 1

  // HDL cholesterol points (protective)
  if (patient.cholesterolHDL >= 60) points -= 2
  else if (patient.cholesterolHDL < 35) points += 2
  else if (patient.cholesterolHDL < 45) points += 1

  // Blood pressure points
  if (patient.bloodPressureSystolic >= 160) points += 3
  else if (patient.bloodPressureSystolic >= 140) points += 2
  else if (patient.bloodPressureSystolic >= 130) points += 1

  // Smoking
  if (patient.smokingStatus) points += 4

  // Diabetes
  if (patient.diabetesStatus) points += 3

  // Convert points to percentage risk (simplified)
  const riskPercentage = Math.min(Math.max(points * 2.5, 1), 50)
  return riskPercentage
}

// Comprehensive risk assessment
export function assessCardiovascularRisk(patient: PatientData): RiskAssessment {
  const tenYearRisk = calculateFraminghamRisk(patient)

  // Calculate individual risk factors
  const riskFactors: RiskFactor[] = [
    {
      name: "Age",
      value: patient.age,
      risk: patient.age > 65 ? "high" : patient.age > 45 ? "medium" : "low",
      weight: 0.2,
      description: "Age is a non-modifiable risk factor for cardiovascular disease",
      normalRange: "N/A",
    },
    {
      name: "Blood Pressure",
      value: `${patient.bloodPressureSystolic}/${patient.bloodPressureDiastolic}`,
      risk:
        patient.bloodPressureSystolic > 140 || patient.bloodPressureDiastolic > 90
          ? "high"
          : patient.bloodPressureSystolic > 130 || patient.bloodPressureDiastolic > 80
            ? "medium"
            : "low",
      weight: 0.25,
      description: "Elevated blood pressure increases cardiovascular risk",
      normalRange: "<120/80 mmHg",
    },
    {
      name: "Total Cholesterol",
      value: patient.cholesterolTotal,
      risk: patient.cholesterolTotal > 240 ? "high" : patient.cholesterolTotal > 200 ? "medium" : "low",
      weight: 0.15,
      description: "High cholesterol contributes to atherosclerosis",
      normalRange: "<200 mg/dL",
    },
    {
      name: "HDL Cholesterol",
      value: patient.cholesterolHDL,
      risk: patient.cholesterolHDL < 40 ? "high" : patient.cholesterolHDL < 50 ? "medium" : "low",
      weight: 0.1,
      description: "Low HDL cholesterol reduces cardiovascular protection",
      normalRange: ">50 mg/dL (women), >40 mg/dL (men)",
    },
    {
      name: "LDL Cholesterol",
      value: patient.cholesterolLDL,
      risk: patient.cholesterolLDL > 160 ? "high" : patient.cholesterolLDL > 130 ? "medium" : "low",
      weight: 0.15,
      description: "LDL cholesterol is the primary atherogenic lipoprotein",
      normalRange: "<100 mg/dL",
    },
    {
      name: "BMI",
      value: patient.bmi,
      risk: patient.bmi > 30 ? "high" : patient.bmi > 25 ? "medium" : "low",
      weight: 0.1,
      description: "Obesity increases cardiovascular risk through multiple mechanisms",
      normalRange: "18.5-24.9 kg/m²",
    },
    {
      name: "Smoking Status",
      value: patient.smokingStatus ? "Current smoker" : "Non-smoker",
      risk: patient.smokingStatus ? "high" : "low",
      weight: 0.2,
      description: "Smoking significantly increases cardiovascular risk",
      normalRange: "Non-smoker",
    },
    {
      name: "Diabetes",
      value: patient.diabetesStatus ? "Present" : "Absent",
      risk: patient.diabetesStatus ? "high" : "low",
      weight: 0.15,
      description: "Diabetes is a major cardiovascular risk factor",
      normalRange: "Absent",
    },
    {
      name: "Family History",
      value: patient.familyHistory ? "Positive" : "Negative",
      risk: patient.familyHistory ? "medium" : "low",
      weight: 0.1,
      description: "Family history indicates genetic predisposition",
      normalRange: "Negative",
    },
    {
      name: "Physical Activity",
      value: patient.physicalActivity,
      risk: patient.physicalActivity === "low" ? "medium" : "low",
      weight: 0.1,
      description: "Regular physical activity reduces cardiovascular risk",
      normalRange: "Moderate to high",
    },
  ]

  // Calculate weighted risk score
  const riskScore = riskFactors.reduce((acc, factor) => {
    const riskValue = factor.risk === "high" ? 3 : factor.risk === "medium" ? 2 : 1
    return acc + riskValue * factor.weight * 100
  }, 0)

  // Determine overall risk level
  const overallRisk: "low" | "medium" | "high" = riskScore >= 200 ? "high" : riskScore >= 150 ? "medium" : "low"

  // Generate recommendations
  const recommendations = generateRecommendations(patient, riskFactors, overallRisk)

  // Determine urgency level
  const urgencyLevel: "routine" | "urgent" | "immediate" =
    overallRisk === "high" && tenYearRisk > 20 ? "immediate" : overallRisk === "high" ? "urgent" : "routine"

  return {
    overallRisk,
    riskScore,
    tenYearRisk,
    riskFactors,
    recommendations,
    urgencyLevel,
  }
}

function generateRecommendations(
  patient: PatientData,
  riskFactors: RiskFactor[],
  overallRisk: "low" | "medium" | "high",
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Blood pressure recommendations
  const bpFactor = riskFactors.find((f) => f.name === "Blood Pressure")
  if (bpFactor?.risk === "high") {
    recommendations.push({
      category: "medication",
      priority: "high",
      title: "Antihypertensive Therapy",
      description: "Initiate ACE inhibitor or ARB therapy. Target BP <130/80 mmHg.",
      timeframe: "Immediate",
    })
  } else if (bpFactor?.risk === "medium") {
    recommendations.push({
      category: "lifestyle",
      priority: "medium",
      title: "Blood Pressure Management",
      description: "Implement DASH diet, reduce sodium intake, increase physical activity.",
      timeframe: "2-4 weeks",
    })
  }

  // Cholesterol recommendations
  const cholFactor = riskFactors.find((f) => f.name === "Total Cholesterol")
  if (cholFactor?.risk === "high" || overallRisk === "high") {
    recommendations.push({
      category: "medication",
      priority: "high",
      title: "Statin Therapy",
      description: "Initiate high-intensity statin therapy. Target LDL <70 mg/dL.",
      timeframe: "Immediate",
    })
  }

  // Smoking cessation
  if (patient.smokingStatus) {
    recommendations.push({
      category: "lifestyle",
      priority: "high",
      title: "Smoking Cessation",
      description: "Immediate smoking cessation with pharmacological support if needed.",
      timeframe: "Immediate",
    })
  }

  // Diabetes management
  if (patient.diabetesStatus) {
    recommendations.push({
      category: "monitoring",
      priority: "high",
      title: "Diabetes Management",
      description: "Optimize glycemic control. Target HbA1c <7% for most patients.",
      timeframe: "Ongoing",
    })
  }

  // Weight management
  if (patient.bmi > 25) {
    recommendations.push({
      category: "lifestyle",
      priority: "medium",
      title: "Weight Management",
      description: "Target 5-10% weight reduction through diet and exercise.",
      timeframe: "3-6 months",
    })
  }

  // Physical activity
  if (patient.physicalActivity === "low") {
    recommendations.push({
      category: "lifestyle",
      priority: "medium",
      title: "Exercise Program",
      description: "Initiate moderate-intensity aerobic exercise 150 minutes/week.",
      timeframe: "2-4 weeks",
    })
  }

  // Cardiology referral for high-risk patients
  if (overallRisk === "high") {
    recommendations.push({
      category: "referral",
      priority: "high",
      title: "Cardiology Consultation",
      description: "Refer to cardiology for comprehensive evaluation and management.",
      timeframe: "1-2 weeks",
    })
  }

  // Monitoring recommendations
  recommendations.push({
    category: "monitoring",
    priority: overallRisk === "high" ? "high" : "medium",
    title: "Follow-up Monitoring",
    description: `Regular monitoring of cardiovascular risk factors. Next visit in ${
      overallRisk === "high" ? "1-3 months" : "3-6 months"
    }.`,
    timeframe: overallRisk === "high" ? "1-3 months" : "3-6 months",
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

// Risk stratification based on guidelines
export function getAHAACCRiskCategory(tenYearRisk: number): {
  category: string
  description: string
  color: string
} {
  if (tenYearRisk >= 20) {
    return {
      category: "High Risk",
      description: "≥20% 10-year ASCVD risk",
      color: "destructive",
    }
  } else if (tenYearRisk >= 7.5) {
    return {
      category: "Intermediate Risk",
      description: "7.5-19.9% 10-year ASCVD risk",
      color: "default",
    }
  } else {
    return {
      category: "Low Risk",
      description: "<7.5% 10-year ASCVD risk",
      color: "secondary",
    }
  }
}
