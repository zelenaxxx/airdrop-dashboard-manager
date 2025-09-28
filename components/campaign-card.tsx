import * as React from "react"
import { IconCalendar, IconCoin, IconUsers, IconClock, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from "/components/ui/badge"
import { Button } from "/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card"
import { Progress } from "/components/ui/progress"
import { Skeleton } from "/components/ui/skeleton"
import { CampaignDetailModal } from "./campaign-detail-modal"

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
}

interface CampaignCardProps {
  campaign: Campaign
}

import { CampaignDetailModal } from "./campaign-detail-modal"

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getClaimRateTrend = () => {
    return campaign.claimRate >= 70 ? 'up' : campaign.claimRate >= 50 ? 'stable' : 'down'
  }

  const getProgressColor = () => {
    if (campaign.progress >= 80) return 'bg-green-500'
    if (campaign.progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="campaign-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="campaign-card-header pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {campaign.name}
            </CardTitle>
            <CardDescription className={`line-clamp-2 ${isExpanded ? 'line-clamp-none' : ''}`}>
              {campaign.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge variant={getStatusBadgeVariant(campaign.status)} className="animate-pulse">
              {campaign.status}
            </Badge>
            <span className={`text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
              {campaign.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar with Animation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Distribution Progress</span>
            <span className={`font-bold ${campaign.progress >= 80 ? 'text-green-600' : campaign.progress >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {campaign.progress.toFixed(1)}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={campaign.progress} 
              className="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
            />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconUsers className="size-4 text-blue-600" />
              <span>Participants</span>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{formatNumber(campaign.totalParticipants)}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconCoin className="size-4 text-green-600" />
              <span>Tokens</span>
            </div>
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">
              {formatNumber(campaign.distributedTokens)}
            </p>
            <p className="text-xs text-muted-foreground">
              / {formatNumber(campaign.totalTokens)} {campaign.tokenSymbol}
            </p>
          </div>
        </div>

        {/* Claim Rate with Trend */}
        <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconTrendingUp className={`size-4 ${
                getClaimRateTrend() === 'up' ? 'text-green-600' : 
                getClaimRateTrend() === 'stable' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span>Claim Rate</span>
            </div>
            <span className={`font-bold text-lg ${
              campaign.claimRate >= 70 ? 'text-green-600' : 
              campaign.claimRate >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {campaign.claimRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>{campaign.totalClaimed.toLocaleString()} claimed</span>
            <span>of {campaign.totalParticipants.toLocaleString()}</span>
          </div>
        </div>

        {/* Dates and Category */}
        <div className="flex items-center justify-between text-sm border-t pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <span className="font-medium">{formatDate(campaign.startDate)}</span>
            <span className="text-muted-foreground">to</span>
            <span className="font-medium">{formatDate(campaign.endDate)}</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <IconClock className="size-3 mr-1" />
            {campaign.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100"
            onClick={() => setIsModalOpen(true)}
          >
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Manage Campaign
          </Button>
        </div>
      </CardFooter>

      <CampaignDetailModal 
        campaign={campaign}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Card>
  )
}