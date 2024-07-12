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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Icons
import { Plus, X } from "lucide-react";

const moneySchema = z.object({
  name: z.string().min(1, { message: "Please your state reason" }),
  amount: z.string(),
});

export default function AddMoneyForm({
  close,
  currentTotal,
}: {
  close: () => void;
  currentTotal: number;
}) {
  const form = useForm<z.infer<typeof moneySchema>>({
    resolver: zodResolver(moneySchema),
    defaultValues: {
      name: "",
      amount: "",
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof moneySchema>) => {
      const newMoneyData = {
        name: values.name,
        amount: Number(values.amount),
      };
      const { error } = await addMoney(newMoneyData, currentTotal);
      if (error) {
        return error;
      }
      close();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof moneySchema>) =>
          mutateMoney(values),
        )}
        className="flex flex-col gap-2 w-[320px] mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input data-vaul-no-drag placeholder="name" {...field} />
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
              <FormControl>
                <Input
                  data-vaul-no-drag
                  placeholder="amount"
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
