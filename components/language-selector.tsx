"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages, Globe } from "lucide-react"

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "sat", name: "Santali", flag: "🏛️" },
  ]

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    // Enhanced language change handler
    try {
      // Store language preference
      localStorage.setItem("preferred-language", language)
      
      // Emit custom event for other components to listen to language changes
      window.dispatchEvent(new CustomEvent('languageChange', { detail: language }))
      
      console.log(`Language changed to: ${language}`)
    } catch (error) {
      console.error("Error changing language:", error)
    }
  }

  return (
    // Removed fixed positioning to prevent conflicts with header
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{selectedLanguage}</span>
          <Languages className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.name)}
            className={`cursor-pointer ${
              selectedLanguage === language.name ? "bg-accent text-accent-foreground" : ""
            }`} // Added visual feedback for selected language
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {selectedLanguage === language.name && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
