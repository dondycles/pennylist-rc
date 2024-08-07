import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";

// Actions
import { addMoney } from "@/app/_actions/moneys";

// Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Icons
import { Plus, X } from "lucide-react";
import { AddMoneySchema } from "@/lib/types";

export default function AddMoneyForm({
  close,
  currentTotal,
}: {
  close: () => void;
  currentTotal: number;
}) {
  const form = useForm<z.infer<typeof AddMoneySchema>>({
    resolver: zodResolver(AddMoneySchema),
    defaultValues: {
      name: "",
      amount: undefined,
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof AddMoneySchema>) => {
      const newMoneyData = {
        name: values.name,
        amount: Number(values.amount),
      };
      const { error } = await addMoney(newMoneyData, currentTotal);
      if (error) {
        return form.setError("amount", { message: error });
      }
      close();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof AddMoneySchema>) =>
          mutateMoney(values),
        )}
        className="flex flex-col gap-2 w-[320px] mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Money name
              </FormLabel>
              <FormControl>
                <Input data-vaul-no-drag placeholder="e.g. PayPal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Money amount
              </FormLabel>
              <FormControl>
                <Input
                  data-vaul-no-drag
                  placeholder="Amount"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" flex flex-row gap-2">
          <Button
            size={"sm"}
            data-vaul-no-drag
            disabled={isPending}
            type="submit"
            className={`${isPending && "animate-pulse"} flex-1`}
          >
            <Plus className="size-5" />
          </Button>
          <Button
            onClick={close}
            type="button"
            size={"sm"}
            disabled={isPending}
            variant={"outline"}
            className="aspect-square p-0"
          >
            <X className="size-5 min-w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
