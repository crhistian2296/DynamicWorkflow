"use client";

import { Card } from "@/components/ui/card";
import { LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import DeleteCredentialDialog from "./DeleteCredentialDialog";

interface Props {
  id: string;
  name: string;
  createdAt: string;
}

const CredentialCard = ({ id, name, createdAt }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full p-4 flex justify-between">
      <div className="flex gap-4 items-center">
        <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
          <LockKeyholeIcon size={18} className="stroke-primary" />
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-muted-foreground">{createdAt} ago</p>
        </div>
      </div>
      <DeleteCredentialDialog
        open={open}
        setOpen={setOpen}
        name={name}
        credentialId={id}
      />
    </Card>
  );
};

export default CredentialCard;
