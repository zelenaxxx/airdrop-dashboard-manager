"use client"

import { useState, useMemo } from "react"
import { CampaignCard } from "./campaign-card"
import { CampaignGridSkeleton } from "./campaign-card-skeleton"
import { DataManagement, FilterControls } from "./data-management"
import data from "/app/dashboard/data.json"

export function CampaignGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Get unique categories from data
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map(campaign => campaign.category))]
    return uniqueCategories.sort()
  }, [])

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = data.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.campaignId.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
      const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "participants":
          return b.totalParticipants - a.totalParticipants
        case "progress":
          return b.progress - a.progress
        case "startDate":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "endDate":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, statusFilter, categoryFilter, sortBy])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredCampaigns, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `airdrop-campaigns-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCreateCampaign = () => {
    // TODO: Implement create campaign functionality
    alert('Create campaign functionality coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Data Management Controls */}
      <div className="px-4 lg:px-6">
        <DataManagement
          onRefresh={handleRefresh}
          onExport={handleExport}
          onCreate={handleCreateCampaign}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
        />
      </div>

      {/* Filter Controls */}
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Airdrop Campaigns</h2>
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />
        <div className="text-sm text-muted-foreground mt-2">
          Showing {filteredCampaigns.length} of {data.length} campaigns
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3">
        {isLoading ? (
          <CampaignGridSkeleton />
        ) : filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.campaignId} campaign={campaign} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V7a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h8.694z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground max-w-sm">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}