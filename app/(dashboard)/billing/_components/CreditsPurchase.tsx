"use client";

import PurchaseCredits from "@/actions/billing/PurchaseCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { creditsPacks, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCard } from "lucide-react";
import { useState } from "react";

const priceInCurrency = (price: number) => {
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  });
  return formatter.format(price / 100);
};

const CreditsPurchase = () => {
  const [selectedPack, setPack] = useState(PackId.STARTER);

  const handleSelectPack = (value: PackId) => {
    setPack(value);
  };

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {},
  });

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
      <RadioGroup onValueChange={handleSelectPack} value={selectedPack}>
        <CardContent>
          {creditsPacks.map((pack) => (
            <div
              key={pack.id}
              onClick={() => handleSelectPack(pack.id)}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary mb-1 last:mb-0"
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between gap-3 items-center w-full cursor-pointer">
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
        <CardFooter>
          <Button
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(selectedPack)}
          >
            <CreditCard className="!h-5 !w-5 mr-1" />
            Proceed to Checkout
          </Button>
        </CardFooter>
      </RadioGroup>
    </Card>
  );
};

export default CreditsPurchase;
