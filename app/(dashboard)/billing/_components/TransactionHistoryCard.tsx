import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserPurchase } from "@prisma/client";
import { ArrowLeftRightIcon } from "lucide-react";
import InvoiceBtn from "./InvoiceBtn";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const TransactionHistoryCard = async () => {
  const purchases = await GetUserPurchaseHistory();
  // return <pre>{JSON.stringify(purchases, null, 4)}</pre>;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon size={24} className="text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          A history of your past transactions, including credits purchased and
          consumed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transactions found.</p>
        )}
        {purchases.map((purchase: UserPurchase) => (
          <div
            key={purchase.id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {(purchase.amount / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: purchase.currency.toUpperCase(),
                })}
              </p>
              <InvoiceBtn id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryCard;
