import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlus, Layers, TrendingUp, Wallet } from "lucide-react";

const stats = [
  { label: "Total NFTs", value: "0", icon: Layers, note: "In collection" },
  { label: "Floor Price", value: "—", icon: TrendingUp, note: "No listings" },
  { label: "Wallet Connected", value: "No", icon: Wallet, note: "Connect wallet" },
];

export function NftManagement() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">NFT Management</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage your NFT collections and assets
              </p>
            </div>
            <Button size="sm" disabled>
              <ImagePlus className="mr-2 h-4 w-4" />
              Mint NFT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Layers className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">No NFTs yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Connect your wallet and start minting NFTs to manage your collection here.
            </p>
            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
