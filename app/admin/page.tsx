"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Utensils,
  Info,
  Settings,
  Users,
  BookOpen,
  BarChart3,
  Home,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Wifi,
  Plus,
  CalendarDays,
  Download,
  RefreshCw,
  Wand2,
  AlertCircle,
  User,
} from "lucide-react"

interface Teacher {
  id: string
  name: string
  email: string
  subjects: string[]
  availability: { [key: string]: boolean[] } // day -> periods available
}

interface TimeSlot {
  time: string
  periods: number
}

interface TimetableEntry {
  day: string
  period: number
  subject: string
  teacher: string
  teacherId: string
  isConflict?: boolean
}

interface ScheduleState {
  [key: string]: TimetableEntry[] // semester-section -> entries
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isTimetableDialogOpen, setIsTimetableDialogOpen] = useState(false)
  const [isTeacherAvailabilityOpen, setIsTeacherAvailabilityOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [editingTimetable, setEditingTimetable] = useState<any>(null)

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [scheduleState, setScheduleState] = useState<ScheduleState>({})
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [conflicts, setConflicts] = useState<string[]>([])

  const timeSlots: TimeSlot[] = [
    { time: "9:00 - 10:00", periods: 0 },
    { time: "10:00 - 11:00", periods: 1 },
    { time: "11:00 - 12:00", periods: 2 },
    { time: "12:00 - 1:00", periods: 3 }, // Lunch break
    { time: "2:00 - 3:00", periods: 4 },
    { time: "3:00 - 4:00", periods: 5 },
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const subjects = [
    "Computer Science",
    "Data Structures",
    "Database Systems",
    "Software Engineering",
    "Web Development",
    "Machine Learning",
    "Operating Systems",
    "Network Security",
  ]

  useEffect(() => {
    const sampleTeachers: Teacher[] = [
      {
        id: "t1",
        name: "Prof. Sarah Johnson",
        email: "s.johnson@college.edu",
        subjects: ["Computer Science", "Data Structures"],
        availability: {
          Monday: [true, true, false, false, true, false],
          Tuesday: [true, false, true, false, true, true],
          Wednesday: [false, true, true, false, false, true],
          Thursday: [true, true, false, false, true, false],
          Friday: [true, false, true, false, false, true],
        },
      },
      {
        id: "t2",
        name: "Dr. Michael Smith",
        email: "m.smith@college.edu",
        subjects: ["Database Systems", "Software Engineering"],
        availability: {
          Monday: [false, true, true, false, false, true],
          Tuesday: [true, true, false, false, true, false],
          Wednesday: [true, false, true, false, true, true],
          Thursday: [false, true, true, false, false, true],
          Friday: [true, true, false, false, true, false],
        },
      },
      {
        id: "t3",
        name: "Prof. Lisa Wilson",
        email: "l.wilson@college.edu",
        subjects: ["Web Development", "Machine Learning"],
        availability: {
          Monday: [true, false, true, false, true, false],
          Tuesday: [false, true, false, false, false, true],
          Wednesday: [true, true, false, false, true, true],
          Thursday: [true, false, true, false, false, true],
          Friday: [false, true, true, false, true, false],
        },
      },
    ]
    setTeachers(sampleTeachers)
  }, [])

  const generateTimetable = () => {
    if (!selectedSemester || !selectedSection) return

    setIsGenerating(true)
    const scheduleKey = `${selectedSemester}-${selectedSection}`
    const newSchedule: TimetableEntry[] = []
    const teacherSchedule: { [teacherId: string]: { [day: string]: number[] } } = {}
    const newConflicts: string[] = []

    // Initialize subject distribution with maximum classes per week
    const subjectDistribution: { [subject: string]: { current: number; max: number } } = {
      "Computer Science": { current: 0, max: 3 },
      "Data Structures": { current: 0, max: 3 },
      "Database Systems": { current: 0, max: 3 },
      "Software Engineering": { current: 0, max: 3 },
      "Operating Systems": { current: 0, max: 3 },
      "Web Development": { current: 0, max: 3 },
      "Machine Learning": { current: 0, max: 3 },
      "Network Security": { current: 0, max: 3 },
    }

    // Initialize teacher schedules
    teachers.forEach((teacher) => {
      teacherSchedule[teacher.id] = {}
      days.forEach((day) => {
        teacherSchedule[teacher.id][day] = []
      })
    })

    days.forEach((day) => {
      timeSlots.forEach((slot, periodIndex) => {
        if (periodIndex === 3) return // Skip lunch break

        // Find available teachers for this period with stricter constraints
        const availableTeachers = teachers.filter((teacher) => {
          // Check if teacher is available for this period
          if (!teacher.availability[day]?.[periodIndex]) return false

          // Check no consecutive classes constraint (must have free period after each class)
          const teacherDaySchedule = teacherSchedule[teacher.id][day]

          // If teacher has previous period, they can't teach this period
          if (teacherDaySchedule.includes(periodIndex - 1)) return false

          // If teacher would teach next period, they can't teach this period
          if (periodIndex < timeSlots.length - 1 && teacherDaySchedule.includes(periodIndex + 1)) return false

          return true
        })

        if (availableTeachers.length > 0) {
          let selectedTeacher: Teacher | null = null
          let selectedSubject: string | null = null

          // Get subjects that haven't reached their max allocation
          const availableSubjects = Object.entries(subjectDistribution)
            .filter(([_, dist]) => dist.current < dist.max)
            .map(([subject]) => subject)

          // Sort subjects by current allocation
          const sortedSubjects = availableSubjects.sort((a, b) => 
            subjectDistribution[a].current - subjectDistribution[b].current
          )

          // Try to find a teacher for the least allocated subject first
          for (const subject of sortedSubjects) {
            const teachersForSubject = availableTeachers.filter((t) => 
              t.subjects.includes(subject)
            )
            
            if (teachersForSubject.length > 0) {
              selectedTeacher = teachersForSubject[Math.floor(Math.random() * teachersForSubject.length)]
              selectedSubject = subject
              break
            }
          }

          // If no teacher found with priority subjects, try any available combination
          if (!selectedTeacher || !selectedSubject) {
            selectedTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)]
            const possibleSubjects = selectedTeacher.subjects.filter(
              subject => subjectDistribution[subject].current < subjectDistribution[subject].max
            )
            
            if (possibleSubjects.length > 0) {
              selectedSubject = possibleSubjects[Math.floor(Math.random() * possibleSubjects.length)]
            } else {
              // If all subjects reached max, pick any subject from teacher's subjects
              selectedSubject = selectedTeacher.subjects[0]
            }
          }

          const entry: TimetableEntry = {
            day,
            period: periodIndex,
            subject: selectedSubject,
            teacher: selectedTeacher.name,
            teacherId: selectedTeacher.id,
            isConflict: subjectDistribution[selectedSubject].current >= subjectDistribution[selectedSubject].max
          }

          newSchedule.push(entry)
          teacherSchedule[selectedTeacher.id][day].push(periodIndex)
          subjectDistribution[selectedSubject].current++
        } else {
          newConflicts.push(`${day} ${slot.time}: No available teachers (constraint violations)`)
        }
      })
    })

    const finalConflicts: string[] = []

    // Check for consecutive classes
    Object.entries(teacherSchedule).forEach(([teacherId, schedule]) => {
      const teacher = teachers.find((t) => t.id === teacherId)
      if (!teacher) return

      Object.entries(schedule).forEach(([day, periods]) => {
        const sortedPeriods = periods.sort((a, b) => a - b)
        for (let i = 0; i < sortedPeriods.length - 1; i++) {
          if (sortedPeriods[i + 1] - sortedPeriods[i] === 1) {
            finalConflicts.push(`${teacher.name} has consecutive classes on ${day}`)
          }
        }
      })
    })

    setScheduleState((prev) => ({ ...prev, [scheduleKey]: newSchedule }))
    setConflicts([...newConflicts, ...finalConflicts])
    setIsGenerating(false)
  }

  const updateTeacherAvailability = (teacherId: string, day: string, period: number, available: boolean) => {
    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id === teacherId) {
          return {
            ...teacher,
            availability: {
              ...teacher.availability,
              [day]: teacher.availability[day]?.map((avail, index) => (index === period ? available : avail)) || [],
            },
          }
        }
        return teacher
      }),
    )

    // Regenerate timetable if changes affect current schedule
    if (selectedSemester && selectedSection) {
      setTimeout(generateTimetable, 100)
    }
  }

  const exportTimetable = () => {
    const scheduleKey = `${selectedSemester}-${selectedSection}`
    const schedule = scheduleState[scheduleKey] || []

    let csvContent = "Day,Time,Subject,Teacher\n"

    days.forEach((day) => {
      timeSlots.forEach((slot, periodIndex) => {
        const entry = schedule.find((s) => s.day === day && s.period === periodIndex)
        if (entry && periodIndex !== 3) {
          csvContent += `${day},${slot.time},${entry.subject},${entry.teacher}\n`
        } else if (periodIndex === 3) {
          csvContent += `${day},${slot.time},Lunch Break,\n`
        } else {
          csvContent += `${day},${slot.time},Free Period,\n`
        }
      })
    })

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `timetable-${selectedSemester}-${selectedSection}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetTimetable = () => {
    const scheduleKey = `${selectedSemester}-${selectedSection}`
    setScheduleState((prev) => ({ ...prev, [scheduleKey]: [] }))
    setConflicts([])
  }

  // Mock data
  const systemStats = {
    totalUsers: 1247,
    activeTeachers: 45,
    totalStudents: 1180,
    totalClasses: 156,
    systemUptime: "99.8%",
    storageUsed: "2.4TB",
    avgAttendance: 89,
    recordingsToday: 23,
  }

  const users = [
    {
      id: 1,
      name: "Prof. Sarah Johnson",
      email: "s.johnson@school.edu",
      role: "Teacher",
      status: "Active",
      lastLogin: "2024-01-15 09:30",
      subjects: ["Computer Science", "Data Structures"],
    },
    {
      id: 2,
      name: "Alex Thompson",
      email: "a.thompson@student.edu",
      role: "Student",
      status: "Active",
      lastLogin: "2024-01-15 14:20",
      semester: "Sem 3",
    },
    {
      id: 3,
      name: "Dr. Michael Smith",
      email: "m.smith@school.edu",
      role: "Teacher",
      status: "Active",
      lastLogin: "2024-01-15 08:45",
      subjects: ["Database Systems", "Software Engineering"],
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "e.davis@student.edu",
      role: "Student",
      status: "Inactive",
      lastLogin: "2024-01-10 16:30",
      semester: "Sem 2",
    },
    {
      id: 5,
      name: "Prof. Lisa Wilson",
      email: "l.wilson@school.edu",
      role: "Teacher",
      status: "Active",
      lastLogin: "2024-01-15 10:15",
      subjects: ["Web Development", "Machine Learning"],
    },
  ]

  const timetables = [
    {
      id: 1,
      semester: "Sem 3",
      section: "A",
      lastUpdated: "2024-01-15",
      totalClasses: 30,
      status: "Active",
    },
    {
      id: 2,
      semester: "Sem 3",
      section: "B",
      lastUpdated: "2024-01-14",
      totalClasses: 30,
      status: "Active",
    },
    {
      id: 3,
      semester: "Sem 5",
      section: "A",
      lastUpdated: "2024-01-13",
      totalClasses: 32,
      status: "Active",
    },
    {
      id: 4,
      semester: "Sem 7",
      section: "A",
      lastUpdated: "2024-01-12",
      totalClasses: 28,
      status: "Draft",
    },
  ]

  const recentActivity = [
    { id: 1, action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Class recording completed", user: "Prof. Johnson", time: "15 minutes ago", type: "recording" },
    { id: 3, action: "Timetable updated", user: "System", time: "1 hour ago", type: "system" },
    { id: 4, action: "Attendance marked", user: "Dr. Smith", time: "2 hours ago", type: "attendance" },
    { id: 5, action: "User role changed", user: "Admin", time: "3 hours ago", type: "user" },
  ]

  const analyticsData = [
    { metric: "Daily Active Users", value: 892, change: "+12%", trend: "up" },
    { metric: "Class Recordings", value: 156, change: "+8%", trend: "up" },
    { metric: "Average Attendance", value: "89%", change: "+2%", trend: "up" },
    { metric: "System Errors", value: 3, change: "-45%", trend: "down" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle className="h-4 w-4 text-chart-4" />
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-accent" />
      case "Error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4" />
      case "server":
        return <Server className="h-4 w-4" />
      case "network":
        return <Wifi className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const handleTimetableAction = (timetable?: any) => {
    setEditingTimetable(timetable || null)
    setSelectedSemester(timetable?.semester || "")
    setSelectedSection(timetable?.section || "")
    setIsTimetableDialogOpen(true)
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-royal">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 shadow-professional">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">System Administration Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="accent" className="text-xs">
                Super Admin
              </Badge>
              <Badge variant="success" className="text-xs">
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats.activeTeachers} teachers, {systemStats.totalStudents} students
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{systemStats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">{systemStats.recordingsToday} recordings today</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{systemStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground">Uptime this month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{systemStats.storageUsed}</div>
              <p className="text-xs text-muted-foreground">Of 5TB total capacity</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="timetables">Timetable Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            {/* ... existing user management code ... */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                <p className="text-muted-foreground">Manage teachers, students, and administrators</p>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account for the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter last name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester (for students)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={`sem${sem}`}>
                              Sem {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90">Create User</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Name</TableHead>
                      <TableHead className="text-foreground">Email</TableHead>
                      <TableHead className="text-foreground">Role</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Last Login</TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "Teacher" ? "default" : user.role === "Student" ? "secondary" : "outline"
                            }
                            className={
                              user.role === "Teacher"
                                ? "bg-accent"
                                : user.role === "Student"
                                  ? "bg-primary"
                                  : "bg-chart-3"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className={user.status === "Active" ? "bg-chart-4" : "bg-muted"}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timetable Management Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={`Sem ${sem}`}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C"].map((section) => (
                    <SelectItem key={section} value={section}>Section {section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={resetTimetable}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={generateTimetable}
                disabled={!selectedSemester || !selectedSection || isGenerating}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Auto Generate"}
              </Button>
              <Button
                variant="outline"
                onClick={exportTimetable}
                disabled={!selectedSemester || !selectedSection}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Conflict Display */}
          {conflicts.length > 0 && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Timetable Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {conflicts.map((conflict, index) => (
                    <li key={index} className="text-destructive text-sm">
                      {conflict}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Timetable Display */}
          <Card className="bg-gradient-to-br from-card to-muted/20 border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span>Live Timetable - {selectedSemester} Section {selectedSection}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-normal">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm"></div>
                      <span className="text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm"></div>
                      <span className="text-muted-foreground">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500 shadow-sm"></div>
                      <span className="text-muted-foreground">Conflict</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm"></div>
                      <span className="text-muted-foreground">Lunch</span>
                    </div>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4" />
                Updates automatically based on teacher availability. Each subject is limited to 3 classes per week.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[900px] p-6">
                  {/* Enhanced Time Grid Layout */}
                  <div className="grid grid-cols-6 gap-4">
                    {/* Time Column Header */}
                    <div className="text-center py-4 font-semibold text-foreground border-b-2 border-border">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                      Time
                    </div>
                    
                    {/* Day Headers */}
                    {days.map((day) => (
                      <div key={day} className="text-center py-4 font-semibold text-foreground border-b-2 border-border">
                        <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                        {day}
                      </div>
                    ))}
                    
                    {/* Time Slots */}
                    {timeSlots.map((slot, periodIndex) => {
                      const scheduleKey = `${selectedSemester}-${selectedSection}`
                      const currentSchedule = scheduleState[scheduleKey] || []
                      const isLunchTime = periodIndex === 3

                      return (
                        <React.Fragment key={periodIndex}>
                          {/* Time Label */}
                          <div className="flex items-center justify-center py-6 px-3 bg-muted/30 rounded-lg border border-border/50">
                            <div className="text-center">
                              <div className="font-semibold text-foreground text-sm">{slot.time}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Period {periodIndex + 1}
                              </div>
                              {isLunchTime && (
                                <Badge variant="secondary" className="mt-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                  <Utensils className="h-3 w-3 mr-1" />
                                  Lunch
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Day Cells */}
                          {days.map((day) => {
                            const entry = currentSchedule.find(
                              (s) => s.day === day && s.period === periodIndex,
                            )

                            if (isLunchTime) {
                              return (
                                <div key={day} className="flex items-center justify-center py-6 px-3">
                                  <div className="w-full h-16 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 flex items-center justify-center">
                                    <div className="text-center">
                                      <Utensils className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                                      <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">Lunch Break</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <div key={day} className="py-3 px-2">
                                {entry ? (
                                  <div className={`
                                    relative group cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
                                    ${entry.isConflict 
                                      ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-2 border-red-300 dark:border-red-700 shadow-red-100 dark:shadow-red-900' 
                                      : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-2 border-blue-300 dark:border-blue-600 shadow-blue-100 dark:shadow-blue-900'
                                    }
                                    rounded-xl p-4 shadow-lg hover:shadow-xl min-h-[80px] flex flex-col justify-center
                                  `}>
                                    {/* Subject and Teacher Info */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                        entry.isConflict ? 'bg-red-500' : 'bg-blue-500'
                                      }`}></div>
                                      <h4 className="font-bold text-sm text-foreground truncate">
                                        {entry.subject}
                                      </h4>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      <span className="truncate">{entry.teacher}</span>
                                    </div>
                                    
                                    {/* Conflict Indicator */}
                                    {entry.isConflict && (
                                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Conflict</span>
                                      </div>
                                    )}
                                    
                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-2">
                                      <Button size="sm" variant="secondary" className="text-xs h-7 px-2">
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="destructive" className="text-xs h-7 px-2">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all">
                                      <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary mb-1" />
                                      <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                                        Free Period
                                      </span>
                                      <span className="text-xs text-muted-foreground/70 mt-1">
                                        Click to assign
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Key metrics and performance indicators</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.map((metric, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          metric.trend === "up" ? "text-chart-4" : "text-destructive"
                        }`}
                      >
                        <TrendingUp className={`h-4 w-4 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                        {metric.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
              <p className="text-muted-foreground">Latest system activities and user actions</p>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {activity.type === "user" && <Users className="h-4 w-4 text-primary" />}
                          {activity.type === "recording" && <BookOpen className="h-4 w-4 text-primary" />}
                          {activity.type === "system" && <Settings className="h-4 w-4 text-primary" />}
                          {activity.type === "attendance" && <Calendar className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
              <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">General Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Basic system configuration options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">College Name</Label>
                    <Input id="schoolName" defaultValue="EduFlow College of Engineering" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Security Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Update Security</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
