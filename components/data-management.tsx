"use client"

import { useState } from "react"
import { IconRefresh, IconDownload, IconUpload, IconPlus, IconFilter, IconSearch } from "@tabler/icons-react"
import { Button } from "/components/ui/button"
import { toast } from "sonner"

interface DataManagementProps {
  onRefresh?: () => void
  onExport?: () => void
  onImport?: () => void
  onCreate?: () => void
  isLoading?: boolean
  lastUpdated?: Date
}

export function DataManagement({ 
  onRefresh, 
  onExport, 
  onImport, 
  onCreate, 
  isLoading = false, 
  lastUpdated 
}: DataManagementProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh?.()
      toast.success("Data refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExport = () => {
    try {
      onExport?.()
      toast.success("Data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
    }
  }

  const handleImport = () => {
    try {
      onImport?.()
      toast.success("Data imported successfully")
    } catch (error) {
      toast.error("Failed to import data")
    }
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2"
        >
          <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <IconDownload className="h-4 w-4" />
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleImport}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <IconUpload className="h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {lastUpdated && (
          <div className="text-sm text-muted-foreground">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}
        
        <Button
          variant="default"
          size="sm"
          onClick={onCreate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <IconPlus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>
    </div>
  )
}

export function FilterControls({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  categoryFilter, 
  onCategoryChange, 
  sortBy, 
  onSortChange, 
  categories 
}: {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  categories: string[]
}) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="participants">Sort by Participants</option>
          <option value="progress">Sort by Progress</option>
          <option value="startDate">Sort by Start Date</option>
          <option value="endDate">Sort by End Date</option>
        </select>
      </div>
    </div>
  )
}