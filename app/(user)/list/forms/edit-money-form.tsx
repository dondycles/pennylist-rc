/* eslint-disable react-hooks/exhaustive-deps */
import { editMoney } from "@/app/actions/moneys";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Database } from "@/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const moneySchema = z.object({
  name: z.string().min(1),
  amount: z.string(),
  id: z.string().uuid(),
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
  reason: z.string().min(1).max(55),
  add: z.string().optional(),
  ded: z.string().optional(),
});

export default function EditMoneyForm({
  close,
  money,
  currentTotal,
}: {
  close: () => void;
  money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "list">;
  currentTotal: string;
}) {
  const form = useForm<z.infer<typeof moneySchema>>({
    resolver: zodResolver(moneySchema),
    defaultValues: {
      name: money.name,
      amount: String(money.amount),
      id: money.id,
      created_at: money.created_at,
      color: money.color,
      updated_at: money.updated_at,
      reason: "",
      ded: "",
      add: "",
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof moneySchema>) => {
      const newMoneyData = {
        name: values.name,
        amount: Number(values.amount),
        id: money.id,
        created_at: money.created_at,
        color: money.color,
        updated_at: money.updated_at,
      };
      const { error } = await editMoney(
        newMoneyData,
        money,
        currentTotal,
        values.reason,
        values.id
      );
      if (error) {
        return error;
      }
      close();
    },
  });

  useEffect(() => {
    if (form.getValues("add")) {
      form.setValue("ded", "");
    } else form.setValue("amount", String(money.amount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("add")]);
  useEffect(() => {
    if (form.getValues("ded")) {
      form.setValue("add", "");
    } else form.setValue("amount", String(money.amount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("ded")]);
  useEffect(() => {
    form.setValue(
      "amount",
      String(
        Number(money.amount) -
          Number(form.watch("ded")) +
          Number(form.watch("add"))
      )
    );
  }, [form.watch("add"), form.watch("ded")]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof moneySchema>) =>
          mutateMoney(values)
        )}
        className="flex flex-col gap-2 w-[320px] mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoFocus
                  data-vaul-no-drag
                  placeholder="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-grow-0">
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
              <FormItem className="flex-1">
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
              <FormItem className="flex-1">
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
        {form.watch("ded") ||
          (form.watch("add") && (
            <p className="text-sm">
              Final amount:{" "}
              <span>
                {Number(money.amount) -
                  Number(form.watch("ded")) +
                  Number(form.watch("add"))}
              </span>
            </p>
          ))}

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
        <div className=" flex flex-row gap-4">
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
