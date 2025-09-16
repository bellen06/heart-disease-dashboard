"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserPlus, Edit, Trash2, Filter } from "lucide-react"
import PatientForm from "./patient-form"

interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  risk: "low" | "medium" | "high"
  lastVisit: string
  heartRate: number
  bloodPressure: string
}

interface PatientListProps {
  patients: Patient[]
  selectedPatient: string
  onSelectPatient: (patientId: string) => void
  onUpdatePatients: (patients: Patient[]) => void
}

export default function PatientList({
  patients,
  selectedPatient,
  onSelectPatient,
  onUpdatePatients,
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRisk, setFilterRisk] = useState<"all" | "low" | "medium" | "high">("all")
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>()

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRisk === "all" || patient.risk === filterRisk
    return matchesSearch && matchesFilter
  })

  const handleAddPatient = () => {
    setEditingPatient(undefined)
    setShowForm(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDeletePatient = (patientId: string) => {
    const updatedPatients = patients.filter((p) => p.id !== patientId)
    onUpdatePatients(updatedPatients)

    // If deleted patient was selected, select first remaining patient
    if (selectedPatient === patientId && updatedPatients.length > 0) {
      onSelectPatient(updatedPatients[0].id)
    }
  }

  const handleSavePatient = (patientData: any) => {
    if (editingPatient) {
      // Update existing patient
      const updatedPatients = patients.map((p) =>
        p.id === editingPatient.id
          ? {
              ...p,
              ...patientData,
              risk: calculateRisk(patientData),
              bloodPressure: `${patientData.bloodPressureSystolic}/${patientData.bloodPressureDiastolic}`,
            }
          : p,
      )
      onUpdatePatients(updatedPatients)
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        risk: calculateRisk(patientData),
        lastVisit: new Date().toLocaleDateString(),
        heartRate: 72,
        bloodPressure: `${patientData.bloodPressureSystolic}/${patientData.bloodPressureDiastolic}`,
      }
      onUpdatePatients([...patients, newPatient])
    }
    setShowForm(false)
  }

  const calculateRisk = (data: any): "low" | "medium" | "high" => {
    let riskScore = 0

    if (data.age > 65) riskScore += 3
    else if (data.age > 45) riskScore += 2
    else riskScore += 1

    if (data.bloodPressureSystolic > 140) riskScore += 3
    else if (data.bloodPressureSystolic > 120) riskScore += 2
    else riskScore += 1

    if (data.cholesterolTotal > 240) riskScore += 3
    else if (data.cholesterolTotal > 200) riskScore += 2
    else riskScore += 1

    if (data.smokingStatus) riskScore += 2
    if (data.diabetesStatus) riskScore += 2
    if (data.familyHistory) riskScore += 1

    if (riskScore >= 12) return "high"
    if (riskScore >= 8) return "medium"
    return "low"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">Patient Management</CardTitle>
              <CardDescription>Manage patient records and cardiovascular assessments</CardDescription>
            </div>
            <Button onClick={handleAddPatient} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Patient
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {["all", "low", "medium", "high"].map((risk) => (
                  <Button
                    key={risk}
                    variant={filterRisk === risk ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRisk(risk as any)}
                  >
                    {risk === "all" ? "All" : `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPatient === patient.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary/30"
                }`}
                onClick={() => onSelectPatient(patient.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Age: {patient.age}</span>
                        <span>•</span>
                        <span>{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</span>
                        <span>•</span>
                        <span>BP: {patient.bloodPressure}</span>
                        <span>•</span>
                        <span>Last visit: {patient.lastVisit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        patient.risk === "high" ? "destructive" : patient.risk === "medium" ? "default" : "secondary"
                      }
                    >
                      {patient.risk.toUpperCase()} RISK
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPatient(patient)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePatient(patient.id)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No patients found matching your criteria.</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={handleAddPatient}>
                Add your first patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PatientForm
        patient={editingPatient}
        isOpen={showForm}
        onSave={handleSavePatient}
        onCancel={() => setShowForm(false)}
      />
    </>
  )
}
