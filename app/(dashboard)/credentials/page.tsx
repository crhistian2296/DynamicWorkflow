import GetCredentialsForUser from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Suspense } from "react";
import CreateCredentialDialog from "./_components/CreateCredentialDialog";
import CredentialCard from "./_components/CredentialCard";

const CredentialsPage = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            private and protected.
          </AlertDescription>
        </Alert>
        <Suspense fallback={<div>Loading credentials...</div>}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
};

const UserCredentials = async () => {
  const credentials = await GetCredentialsForUser();
  if (!credentials) return <div>No credentials found.</div>;

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOffIcon size={32} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Start by adding a new credential to get started.
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap mt-8">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt);
        return (
          <CredentialCard
            key={credential.id}
            id={credential.id}
            name={credential.name}
            createdAt={createdAt}
          />
        );
      })}
    </div>
  );
};

export default CredentialsPage;
