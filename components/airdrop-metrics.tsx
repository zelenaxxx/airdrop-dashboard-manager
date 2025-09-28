import { IconCoin, IconUsers, IconGift, IconTrendingUp, IconCalendar, IconAlertCircle } from "@tabler/icons-react"
import { Badge } from "/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/components/ui/card"
import data from "/app/dashboard/data.json"
import { format } from "date-fns"

export function AirdropMetrics() {
  // Calculate metrics from data
  const totalCampaigns = data.length
  const activeCampaigns = data.filter(campaign => campaign.status === 'active').length
  const completedCampaigns = data.filter(campaign => campaign.status === 'completed').length
  const pendingCampaigns = data.filter(campaign => campaign.status === 'pending').length
  
  const totalParticipants = data.reduce((sum, campaign) => sum + campaign.totalParticipants, 0)
  const totalTokensDistributed = data.reduce((sum, campaign) => sum + campaign.distributedTokens, 0)
  const totalTokensAllocated = data.reduce((sum, campaign) => sum + campaign.totalTokens, 0)
  const averageClaimRate = data.reduce((sum, campaign) => sum + campaign.claimRate, 0) / data.length
  
  // Calculate upcoming campaigns
  const today = new Date()
  const upcomingCampaigns = data.filter(campaign => 
    new Date(campaign.startDate) > today
  ).length
  
  // Calculate ending soon campaigns (within 7 days)
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const endingSoonCampaigns = data.filter(campaign => {
    const endDate = new Date(campaign.endDate)
    return endDate <= sevenDaysFromNow && endDate >= today && campaign.status === 'active'
  }).length
  
  // Calculate total value (assuming $1 per token for demo)
  const totalValueDistributed = totalTokensDistributed
  const successRate = (completedCampaigns / totalCampaigns) * 100

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Campaigns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCampaigns}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconGift className="size-4" />
              {activeCampaigns} Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Airdrop campaigns managed
          </div>
          <div className="text-muted-foreground">
            {activeCampaigns} currently running
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Participants</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalParticipants.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
              Across all campaigns
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Users participating in airdrops
          </div>
          <div className="text-muted-foreground">
            Unique participants across campaigns
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tokens Distributed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(totalTokensDistributed / 1000000).toFixed(1)}M
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoin className="size-4" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total tokens airdropped
          </div>
          <div className="text-muted-foreground">
            Across all campaigns
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Claim Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {averageClaimRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              Engagement
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            User engagement rate
          </div>
          <div className="text-muted-foreground">
            Average across campaigns
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}