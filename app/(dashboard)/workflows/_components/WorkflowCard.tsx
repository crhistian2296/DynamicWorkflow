import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStatus } from "@/types/worflows";
import { Workflow } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { WorkflowActions } from "./WorkflowActions";

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { id, name, description, status, createdAt, updatedAt } = workflow;

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-amber-100 text-amber-800",
    [WorkflowStatus.PUBLISHED]: "bg-primary",
    // Fallback for any other status that might be in the database
    default: "bg-gray-100 text-gray-800",
  };

  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  const isUpdated = createdDate.getTime() !== updatedDate.getTime();

  // Get the appropriate color class based on status, with fallback
  const statusColorClass = statusColors[status as WorkflowStatus] || statusColors.default;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            <Link
              href={`/workflow/editor/${id}`}
              className="hover:underline transition-all duration-300"
            >
              {name}
            </Link>
          </CardTitle>
          <Badge className={`${statusColorClass} hover:bg-opacity-60`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        </div>
        {description && (
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
          </div>
          {isUpdated && (
            <div className="flex items-center">
              <SettingsIcon className="mr-1 h-3 w-3" />
              <span>Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workflow/editor/${id}`}>
              <SettingsIcon className="mr-1 h-3 w-3" />
              Edit
            </Link>
          </Button>
          <WorkflowActions workflow={workflow} />
        </div>
      </CardContent>
    </Card>
  );
}
