import { RunBtn } from "@/app/workflow/_components/RunBtn";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkflowStatus } from "@/types/workflows";
import { Workflow } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CoinsIcon,
  CornerDownRightIcon,
  MoveRightIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import SchedulerDialog from "./SchedulerDialog";
import { WorkflowActions } from "./WorkflowActions";

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const {
    id,
    name,
    cron,
    creditsCost,
    description,
    status,
    createdAt,
    updatedAt,
  } = workflow;
  const isDraft = status === WorkflowStatus.DRAFT;

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-amber-100 text-amber-800",
    [WorkflowStatus.PUBLISHED]: "bg-primary text-white",
    // Fallback for any other status that might be in the database
    default: "bg-gray-100 text-gray-800",
  };

  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  const isUpdated = createdDate.getTime() !== updatedDate.getTime();

  // Get the appropriate color class based on status, with fallback
  const statusColorClass =
    statusColors[status as WorkflowStatus] || statusColors.default;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md ">
      <CardHeader className="sm:p-4 sm:pb-2 p-2 pb-2">
        <div className="flex justify-start items-center gap-2">
          <CardTitle className="text-lg font-semibold">
            <Link
              href={`/workflow/editor/${id}`}
              className="underline decoration-transparent hover:decoration-current transition-all duration-300"
            >
              {name}
            </Link>
          </CardTitle>
          <Badge className={`${statusColorClass} hover:bg-opacity-60`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
          <div className="ml-auto self-end flex gap-1">
            {!isDraft && <RunBtn workflowId={id} />}
            <WorkflowActions workflow={workflow} />
          </div>
        </div>
        {description && (
          <CardDescription className="text-sm text-gray-500 line-clamp-2 mt-0">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex xl:items-start sm:p-4 p-2 sm:pt-0 pt-0 gap-1 flex-col items-start justify-between">
        <ScheduleSection
          isDraft={isDraft}
          workflowId={id}
          creditsCost={creditsCost}
          workflowCron={cron}
        />
        <div className="flex flex-col items-start text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>
              Created {formatDistanceToNow(createdDate, { addSuffix: true })}
            </span>
          </div>
          {isUpdated && (
            <div className="flex items-center ml-0">
              <SettingsIcon className="mr-1 h-3 w-3" />
              <span>
                Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const ScheduleSection = ({
  isDraft,
  workflowId,
  creditsCost,
  workflowCron = "",
}: {
  isDraft: boolean;
  workflowId: string;
  creditsCost: number;
  workflowCron: string | null;
}) => {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-1">
      <CornerDownRightIcon className="mr-1 h-4 w-4 text-muted-foreground" />
      <SchedulerDialog workflowId={workflowId} cronValue={workflowCron} />
      <MoveRightIcon className="mr-1 h-4 w-4 text-muted-foreground" />
      <TooltipWrapper text="Credit consumption for full run:">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-muted-foreground ">
            <CoinsIcon className="mr-1 h-3 w-3" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};
