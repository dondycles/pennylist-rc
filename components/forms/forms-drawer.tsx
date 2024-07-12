import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export default function FormsDrawer({
  trigger,
  form,
  open,
  onOpenChange,
  title,
  desc,
}: {
  trigger?: React.ReactNode;
  form: React.ReactNode;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: ((open: boolean) => void) | undefined;
  title: string;
  desc: string;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent className="p-2 gap-2">
        <DrawerHeader className="py-2 px-0 w-[320px] mx-auto">
          <DrawerTitle>
            <p className="font-bold text-sm text-center">{title}</p>
          </DrawerTitle>
          <DrawerDescription className="text-center">{desc}</DrawerDescription>
        </DrawerHeader>
        {form}
      </DrawerContent>
    </Drawer>
  );
}
