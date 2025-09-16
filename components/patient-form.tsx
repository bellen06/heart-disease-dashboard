"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Save, X } from "lucide-react"

interface PatientData {
  id?: string
  name: string
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
  medications: string
  notes: string
}

interface PatientFormProps {
  patient?: PatientData
  onSave: (patient: PatientData) => void
  onCancel: () => void
  isOpen: boolean
}

export default function PatientForm({ patient, onSave, onCancel, isOpen }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientData>(
    patient || {
      name: "",
      age: 0,
      gender: "male",
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      cholesterolTotal: 200,
      cholesterolHDL: 50,
      cholesterolLDL: 100,
      bmi: 25,
      smokingStatus: false,
      diabetesStatus: false,
      familyHistory: false,
      physicalActivity: "moderate",
      medications: "",
      notes: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const calculateRiskLevel = (): "low" | "medium" | "high" => {
    let riskScore = 0

    // Age factor
    if (formData.age > 65) riskScore += 3
    else if (formData.age > 45) riskScore += 2
    else riskScore += 1

    // Blood pressure
    if (formData.bloodPressureSystolic > 140) riskScore += 3
    else if (formData.bloodPressureSystolic > 120) riskScore += 2
    else riskScore += 1

    // Cholesterol
    if (formData.cholesterolTotal > 240) riskScore += 3
    else if (formData.cholesterolTotal > 200) riskScore += 2
    else riskScore += 1

    // BMI
    if (formData.bmi > 30) riskScore += 3
    else if (formData.bmi > 25) riskScore += 2
    else riskScore += 1

    // Risk factors
    if (formData.smokingStatus) riskScore += 2
    if (formData.diabetesStatus) riskScore += 2
    if (formData.familyHistory) riskScore += 1

    if (riskScore >= 12) return "high"
    if (riskScore >= 8) return "medium"
    return "low"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {patient ? "Edit Patient" : "Add New Patient"}
              </CardTitle>
              <CardDescription>Enter patient information for cardiovascular risk assessment</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female" | "other") => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vital Signs & Measurements</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={formData.bloodPressureSystolic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bloodPressureSystolic: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bloodPressureDiastolic: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bmi: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Physical Activity</Label>
                  <Select
                    value={formData.physicalActivity}
                    onValueChange={(value: "low" | "moderate" | "high") =>
                      setFormData({ ...formData, physicalActivity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cholesterol Levels */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cholesterol Profile (mg/dL)</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalChol">Total Cholesterol</Label>
                  <Input
                    id="totalChol"
                    type="number"
                    value={formData.cholesterolTotal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cholesterolTotal: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hdl">HDL Cholesterol</Label>
                  <Input
                    id="hdl"
                    type="number"
                    value={formData.cholesterolHDL}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cholesterolHDL: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL Cholesterol</Label>
                  <Input
                    id="ldl"
                    type="number"
                    value={formData.cholesterolLDL}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cholesterolLDL: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Factors</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <Label htmlFor="smoking" className="font-medium">
                    Current Smoker
                  </Label>
                  <Switch
                    id="smoking"
                    checked={formData.smokingStatus}
                    onCheckedChange={(checked) => setFormData({ ...formData, smokingStatus: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <Label htmlFor="diabetes" className="font-medium">
                    Diabetes
                  </Label>
                  <Switch
                    id="diabetes"
                    checked={formData.diabetesStatus}
                    onCheckedChange={(checked) => setFormData({ ...formData, diabetesStatus: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <Label htmlFor="family" className="font-medium">
                    Family History
                  </Label>
                  <Switch
                    id="family"
                    checked={formData.familyHistory}
                    onCheckedChange={(checked) => setFormData({ ...formData, familyHistory: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="List current medications..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional clinical observations..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Risk Assessment Preview */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between">
                <span className="font-medium">Calculated Risk Level:</span>
                <Badge
                  variant={
                    calculateRiskLevel() === "high"
                      ? "destructive"
                      : calculateRiskLevel() === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="text-sm"
                >
                  {calculateRiskLevel().toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
