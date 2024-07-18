/* eslint-disable react-hooks/exhaustive-deps */
import { editMoney } from "@/app/_actions/moneys";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditMoneySchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditMoneyForm({
  close,
  money,
  currentTotal,
}: {
  // eslint-disable-next-line no-unused-vars
  close: (refetch: boolean) => void;
  money: Omit<MoneyTypes, "list">;
  currentTotal: number;
}) {
  const form = useForm<z.infer<typeof EditMoneySchema>>({
    resolver: zodResolver(EditMoneySchema),
    defaultValues: {
      name: money.name,
      amount: money.amount,
      created_at: money.created_at,
      color: money.color,
      updated_at: String(new Date()),
      reason: "",
      ded: undefined,
      add: undefined,
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof EditMoneySchema>) => {
      const newMoneyData = {
        name: values.name,
        amount: values.amount,
        id: money.id,
        created_at: money.created_at,
        color: money.color,
        updated_at: money.updated_at,
      };

      const { error } = await editMoney(
        money,
        newMoneyData,
        currentTotal,
        values.reason,
        "update",
      );
      if (error) {
        return form.setError("reason", { message: error });
      }
      close(true);
    },
  });

  useEffect(() => {
    if (form.getValues("add")) {
      form.setValue("ded", 0);
    } else form.setValue("amount", money.amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("add")]);
  useEffect(() => {
    if (form.getValues("ded")) {
      form.setValue("add", 0);
    } else form.setValue("amount", money.amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("ded")]);
  useEffect(() => {
    form.setValue(
      "amount",
      Number(money.amount) -
        Number(form.watch("ded") ?? 0) +
        Number(form.watch("add") ?? 0),
    );
  }, [form.watch("add"), form.watch("ded")]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof EditMoneySchema>) =>
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

        <div className="grid grid-cols-[1fr,1fr,1fr] gap-2">
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
          <FormField
            control={form.control}
            name="add"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-green-500 placeholder:text-2xl placeholder:text-green-500"
                    data-vaul-no-drag
                    placeholder="+"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ded"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-destructive placeholder:text-2xl placeholder:text-destructive"
                    data-vaul-no-drag
                    placeholder="-"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input data-vaul-no-drag placeholder="reason" {...field} />
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
            <Pencil className="size-4" />
          </Button>
          <Button
            onClick={() => close(false)}
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
