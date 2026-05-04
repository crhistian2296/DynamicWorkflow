"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { creditsPacks } from "@/types/billing";
import { CoinsIcon } from "lucide-react";

const CreditsPurchase = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon size={24} className="text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase and proceed to
          checkout. Credits will be added to your account immediately after
          successful payment.
        </CardDescription>
      </CardHeader>
      <RadioGroup>
        <CardContent>
          {creditsPacks.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary mb-1 last:mb-0"
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between items-center w-full cursor-poiter">
                <span className="text-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  {priceInCurrency(pack.price)}
                </span>
              </Label>
            </div>
          ))}
        </CardContent>
      </RadioGroup>
    </Card>
  );

  function priceInCurrency(price: number): import("react").ReactNode {
    const formatter = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    });
    return formatter.format(price / 100);
  }
};

export default CreditsPurchase;
