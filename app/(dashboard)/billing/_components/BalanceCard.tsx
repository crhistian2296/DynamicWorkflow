import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CoinsIcon } from "lucide-react";

const BalanceCard = async () => {
  const userBalance = (await GetAvailableCredits()) ?? 0;
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Available Credits
          </h3>
          <p className="text-4xl font-bold text-primary">
            <ReactCountUpWrapper value={userBalance} />
          </p>
        </div>
        <CoinsIcon
          size={140}
          className="text-primary opacity-20 absolute bottom-0 right-0"
        />
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When you run workflows, credits will be deducted based on the number and
        cost of steps. You can top up your credits in the billing section.
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
