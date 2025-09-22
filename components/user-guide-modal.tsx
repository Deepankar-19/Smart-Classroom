"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BookOpen,
  Users,
  Mic,
  BarChart3,
  Settings,
  GraduationCap,
  UserCheck,
  Clock,
  ChevronRight,
  X,
} from "lucide-react"

export function UserGuideModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Show modal on initial load
    const hasSeenGuide = localStorage.getItem("eduflow-guide-seen")
    if (!hasSeenGuide) {
      setIsOpen(true)
    }
  }, [])

  const guideSteps = [
    {
      title: "Welcome to EduFlow",
      description: "Your smart classroom management system",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">EduFlow</h3>
              <p className="text-sm text-muted-foreground">Smart Classroom Management</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            EduFlow is an AI-powered educational management system designed to streamline classroom operations, track
            attendance, and provide automated transcription services.
          </p>
        </div>
      ),
    },
    {
      title: "Choose Your Role",
      description: "Access role-specific dashboards",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Student Portal</p>
                <p className="text-sm text-muted-foreground">View timetables, attendance, and transcripts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <UserCheck className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Teacher Dashboard</p>
                <p className="text-sm text-muted-foreground">Manage classes and track attendance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Settings className="h-5 w-5 text-chart-3" />
              <div>
                <p className="font-medium">Admin Panel</p>
                <p className="text-sm text-muted-foreground">System management and analytics</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Key Features",
      description: "Explore what EduFlow can do",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">AI Timetable Generation</p>
                <p className="text-sm text-muted-foreground">Automatic scheduling with conflict resolution</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mic className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Class Transcription</p>
                <p className="text-sm text-muted-foreground">Automated recording and transcription</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Real-time Attendance</p>
                <p className="text-sm text-muted-foreground">Live tracking with visual summaries</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Multi-Role Access</p>
                <p className="text-sm text-muted-foreground">Separate dashboards for each user type</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Language Support",
      description: "Multi-language interface",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            EduFlow supports multiple languages to serve diverse educational communities:
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">English</Badge>
            <Badge variant="outline">Hindi</Badge>
            <Badge variant="outline">Santali</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Look for the language selector in the top-left corner to switch between languages.
          </p>
        </div>
      ),
    },
  ]

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("eduflow-guide-seen", "true")
  }

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{guideSteps[currentStep].title}</DialogTitle>
              <DialogDescription>{guideSteps[currentStep].description}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">{guideSteps[currentStep].content}</div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-1">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                Previous
              </Button>
            )}
            <Button size="sm" onClick={nextStep}>
              {currentStep === guideSteps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
