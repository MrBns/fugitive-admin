import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Code2, Globe, Shield } from "lucide-react";

const features = [
  {
    title: "Smart Contracts",
    description: "Deploy and manage smart contracts for your DApp",
    icon: Code2,
    status: "coming-soon" as const,
  },
  {
    title: "Web3 Integration",
    description: "Connect wallets and interact with blockchain networks",
    icon: Globe,
    status: "coming-soon" as const,
  },
  {
    title: "Access Control",
    description: "Manage on-chain permissions and roles",
    icon: Shield,
    status: "coming-soon" as const,
  },
];

export function DappFeatures() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">DApp Features</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Configure and manage your decentralized application
              </p>
            </div>
            <Button size="sm" disabled>
              <Zap className="mr-2 h-4 w-4" />
              Deploy Contract
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="relative overflow-hidden">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between">
                  <feature.icon className="h-5 w-5 text-muted-foreground mb-2" />
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
