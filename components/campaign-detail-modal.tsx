"use client"

import * as React from "react"
import { IconX, IconCalendar, IconCoin, IconUsers, IconClock, IconTrendingUp, IconLink, IconFileText, IconSettings, IconChartBar } from "@tabler/icons-react"
import { Button } from "/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "/components/ui/dialog"
import { Badge } from "/components/ui/badge"
import { Progress } from "/components/ui/progress"
import { Separator } from "/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/components/ui/tabs"

interface Campaign {
  campaignId: string
  name: string
  description: string
  totalParticipants: number
  distributedTokens: number
  totalTokens: number
  tokenSymbol: string
  status: "active" | "completed" | "pending"
  startDate: string
  endDate: string
  progress: number
  allocationPerUser: number
  totalClaimed: number
  claimRate: number
  category: string
  priority: "high" | "medium" | "low"
  createdBy: string
  createdAt: string
  lastUpdated: string
}

interface CampaignDetailModalProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (campaign: Campaign) => void
  onExport?: (campaign: Campaign) => void
}

export function CampaignDetailModal({ 
  campaign, 
  open, 
  onOpenChange, 
  onEdit, 
  onExport 
}: CampaignDetailModalProps) {
  if (!campaign) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "completed": return "bg-blue-500"
      case "pending": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400"
      case "medium": return "text-yellow-600 dark:text-yellow-400"
      case "low": return "text-green-600 dark:text-green-400"
      default: return "text-gray-600 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getTimeRemaining = () => {
    const endDate = new Date(campaign.endDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Campaign ended"
    if (diffDays === 0) return "Ends today"
    if (diffDays === 1) return "1 day remaining"
    return `${diffDays} days remaining`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">
                {campaign.name}
              </DialogTitle>
              <DialogDescription>
                {campaign.description}
              </DialogDescription>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-sm">
                  {campaign.status.toUpperCase()}
                </Badge>
                <span className={`text-sm font-medium ${getPriorityColor(campaign.priority)}`}>
                  {campaign.priority.toUpperCase()} PRIORITY
                </span>
                <Badge variant="outline" className="text-sm">
                  {campaign.category}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <IconChartBar className="h-4 w-4" />Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <IconTrendingUp className="h-4 w-4" />Progress
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <IconUsers className="h-4 w-4" />Participants
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <IconSettings className="h-4 w-4" />Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <IconUsers className="h-5 w-5" />
                  <h3 className="font-semibold">Participants</h3>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatNumber(campaign.totalParticipants)}</p>
                <p className="text-sm text-muted-foreground">{formatNumber(campaign.totalClaimed)} claimed</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <IconCoin className="h-5 w-5" />
                  <h3 className="font-semibold">Tokens</h3>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatNumber(campaign.distributedTokens)}</p>
                <p className="text-sm text-muted-foreground">of {formatNumber(campaign.totalTokens)} {campaign.tokenSymbol}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <IconTrendingUp className="h-5 w-5" />
                  <h3 className="font-semibold">Claim Rate</h3>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{campaign.claimRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Engagement rate</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <IconClock className="h-5 w-5" />
                  <h3 className="font-semibold">Status</h3>
                </div>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100 capitalize">{campaign.status}</p>
                <p className="text-sm text-muted-foreground">{getTimeRemaining()}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Campaign Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{formatDate(campaign.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">{formatDate(campaign.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatDate(campaign.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{formatDate(campaign.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Distribution Progress</h3>
                <span className="text-2xl font-bold">{campaign.progress.toFixed(1)}%</span>
              </div>
              <Progress value={campaign.progress} className="h-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatNumber(campaign.distributedTokens)} distributed</span>
                <span>{formatNumber(campaign.totalTokens)} total</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Distribution Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tokens:</span>
                    <span className="font-medium">{formatNumber(campaign.totalTokens)} {campaign.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distributed:</span>
                    <span className="font-medium">{formatNumber(campaign.distributedTokens)} {campaign.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium">{formatNumber(campaign.totalTokens - campaign.distributedTokens)} {campaign.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Per User:</span>
                    <span className="font-medium">{formatNumber(campaign.allocationPerUser)} {campaign.tokenSymbol}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Participation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Participants:</span>
                    <span className="font-medium">{formatNumber(campaign.totalParticipants)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claimed:</span>
                    <span className="font-medium">{formatNumber(campaign.totalClaimed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unclaimed:</span>
                    <span className="font-medium">{formatNumber(campaign.totalParticipants - campaign.totalClaimed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claim Rate:</span>
                    <span className="font-medium">{campaign.claimRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="text-center py-8"
              <IconUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Participant Management</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Advanced participant management features coming soon. This will include participant lists, 
                eligibility verification, claim status tracking, and bulk operations.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4"
              <h4 className="font-medium">Campaign Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Campaign ID</span>
                  <Badge variant="secondary" className="font-mono">{campaign.campaignId}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <Badge variant="outline">{campaign.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority</span>
                  <span className={`font-medium ${getPriorityColor(campaign.priority)}`}>
                    {campaign.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created By</span>
                  <span className="font-mono text-sm">{campaign.createdBy}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onExport?.(campaign)}
                className="flex items-center gap-2"
              >
                <IconFileText className="h-4 w-4" />
                Export Data
              </Button>
              <Button 
                variant="default" 
                onClick={() => onEdit?.(campaign)}
                className="flex items-center gap-2"
              >
                <IconSettings className="h-4 w-4" />
                Edit Campaign
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}