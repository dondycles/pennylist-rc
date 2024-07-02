import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "./ui/tooltip";

export default function TooltipC({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
