"use client"
import { LanguageSelector } from '@/components/language-selector'
import { UserGuideModal } from '@/components/user-guide-modal'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Mic,
  BarChart3,
  Settings,
  GraduationCap,
  UserCheck,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react"

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false) // Added state for User Guide

  // Open UserGuide immediately when page loads
  useEffect(() => {
    setShowGuide(true)
  }, [])

  const roles = [
    {
      id: "student",
      title: "Student Portal",
      description: "Access your timetable, attendance records, and class transcripts",
      icon: GraduationCap,
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      features: ["View Timetable", "Check Attendance", "Access Transcripts", "Class Materials"],
    },
    {
      id: "teacher",
      title: "Teacher Dashboard",
      description: "Manage classes, input subjects, and track student attendance",
      icon: UserCheck,
      color: "bg-gradient-to-r from-amber-400 to-orange-500",
      features: ["Create Timetables", "Record Classes", "Manage Attendance", "Generate Reports"],
    },
    {
      id: "admin",
      title: "Admin Panel",
      description: "Oversee system resources, generate reports, and manage users",
      icon: Settings,
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      features: ["System Management", "User Administration", "Analytics Dashboard", "Resource Planning"],
    },
  ]

  const systemFeatures = [
    {
      icon: Clock,
      title: "Dynamic Timetable Generation",
      description: "AI-powered scheduling with automatic conflict resolution and teacher availability tracking",
    },
    {
      icon: Mic,
      title: "Class Audio Transcription",
      description: "Automated recording and transcription of class sessions for absent students",
    },
    {
      icon: BarChart3,
      title: "Real-time Attendance",
      description: "Live attendance tracking with visual summaries and historical data",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Separate dashboards for students, teachers, and administrators",
    },
  ]

  const stats = [
    { icon: Award, value: "98%", label: "Attendance Accuracy" },
    { icon: TrendingUp, value: "45%", label: "Time Saved" },
    { icon: Sparkles, value: "500+", label: "Schools Using" },
  ]

  if (selectedRole) {
    window.location.href = `/${selectedRole}`
    return null
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-royal">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-royal pulse-glow">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">EduFlow</h1>
                <p className="text-sm text-gray-600">Smart Classroom Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Controlled User Guide Modal */}
              <UserGuideModal open={showGuide} onOpenChange={setShowGuide} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600 float" />
            <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50/50 shadow-royal">
              AI-Powered Education
            </Badge>
          </div>
          <h2 className="text-6xl font-bold text-gray-900 mb-6 text-balance">
            Revolutionize Your
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"> Classroom Management</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
            AI-powered timetable generation, real-time attendance tracking, and automated class transcription for modern
            educational institutions.
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* System Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {systemFeatures.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 mb-3 shadow-royal">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Selection */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-3">Choose Your Role</h3>
          <p className="text-lg text-gray-600">Select your role to access the appropriate dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="card-hover cursor-pointer group"
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                    role.id === 'student' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 
                    role.id === 'teacher' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 
                    'bg-gradient-to-r from-emerald-500 to-teal-600'
                  } mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-royal pulse-glow`}
                >
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription className="leading-relaxed">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 shadow-royal">
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium">EduFlow Demo - Smart Classroom Management System</p>
            <p className="mt-1">Built with modern web technologies for educational excellence</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
