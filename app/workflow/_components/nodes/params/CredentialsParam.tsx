"use client";

import { GetAiLocalModels } from "@/actions/credentials/getAiLocalModels";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamProps } from "@/types/appNode";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";

const CredentialsParam = ({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) => {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: async () => GetCredentialsForUser(),
    refetchInterval: 10000, // Refetch credentials every 10 seconds in case there are new ones
  });
  const aiModels = useQuery({
    queryKey: ["ai-local-models-for-user"],
    queryFn: async () => GetAiLocalModels(),
    refetchInterval: 10000, // Refetch AI local models every 10 seconds in case there are new ones
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Select
        onValueChange={(value) => {
          console.log("Selected credential or AI model:", value);
          return updateNodeParamValue(value);
        }}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => {
              return (
                <SelectItem
                  key={credential.id}
                  value={`${credential.id} (api key)`}
                >
                  {credential.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
          {aiModels.data && aiModels.data.length > 0 && (
            <SelectGroup>
              <SelectLabel>Local AI models</SelectLabel>
              {aiModels.data?.map(({ model }) => {
                return (
                  <SelectItem key={model} value={`${model} (local model)`}>
                    {model}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CredentialsParam;
