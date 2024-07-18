/* eslint-disable react-hooks/exhaustive-deps */
import { transferMoney } from "@/app/_actions/moneys";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UseAmountFormat } from "@/lib/utils";
import { useListState } from "@/store";
import { TansferMoneySchema } from "@/lib/schemas";

export default function TransferMoneyForm({
  close,
  money,
  currentTotal,
  allMoneys,
}: {
  // eslint-disable-next-line no-unused-vars
  close: (ids?: { to: string; from: string }) => void;
  money: Omit<MoneyTypes, "list">;
  currentTotal: number;
  allMoneys: Omit<MoneyTypes, "list">[];
}) {
  const listState = useListState();
  const form = useForm<z.infer<typeof TansferMoneySchema>>({
    resolver: zodResolver(TansferMoneySchema),
    defaultValues: {
      transferAmount: undefined,
      transferTo: "",
      reason: "",
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof TansferMoneySchema>) => {
      const oldToMoneyData = allMoneys.filter(
        (m) => m.id === values.transferTo,
      )[0];

      const from = {
        oldMoneyData: money,
        newMoneyData: {
          ...money,
          amount:
            Number(money.amount ?? 0) - Number(values.transferAmount ?? 0),
        },
        currentTotal: currentTotal,
      };
      const to = {
        oldMoneyData: oldToMoneyData,
        newMoneyData: {
          ...oldToMoneyData,
          amount:
            Number(oldToMoneyData.amount ?? 0) +
            Number(values.transferAmount ?? 0),
        },
        currentTotal: currentTotal,
      };

      const { error } = await transferMoney(
        { ...from },
        { ...to },
        values.reason,
      );

      if (error) {
        return form.setError("transferTo", { message: error });
      }
      close({ to: to.oldMoneyData.id, from: from.oldMoneyData.id });
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof TansferMoneySchema>) => mutateMoney(values),
        )}
        className="flex flex-col gap-2 w-[320px] mx-auto"
      >
        <p className="text-sm text-muted-foreground">
          Transfer{" "}
          <span style={{ color: money.color ?? "" }}>
            {money.name} (
            <span className="font-readex">
              {UseAmountFormat(money.amount ?? 0, {
                hide: listState.hideAmounts,
                sign: true,
              })}
            </span>
            )
          </span>
        </p>
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="transferTo"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      style={{
                        color:
                          allMoneys.findLast(
                            (money) => money.id === field.value,
                          )?.color ?? "",
                      }}
                    >
                      <SelectValue placeholder="Transfer to" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allMoneys
                      .filter((m) => m.id !== money.id)
                      .map((m) => {
                        return (
                          <SelectItem
                            style={{ color: m.color ?? "" }}
                            key={m.id}
                            value={m.id}
                          >
                            {m.name}:{" "}
                            {UseAmountFormat(m.amount ?? 0, {
                              hide: listState.hideAmounts,
                              sign: true,
                            })}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("transferTo") && (
            <FormField
              control={form.control}
              name="transferAmount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="->"
                      type="number"
                      data-vaul-no-drag
                      className="border-yellow-600 placeholder:text-yellow-600 shrink-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        {form.watch("transferAmount") && (
          <div className="text-sm text-muted-foreground flex flex-col">
            <span>Final: </span>
            <span style={{ color: money.color ?? "" }}>
              {money.name} (
              <span className="font-readex">
                {UseAmountFormat(
                  Number(money.amount ?? 0) -
                    Number(form.watch("transferAmount")),
                  { hide: listState.hideAmounts, sign: true },
                )}
              </span>
              )
            </span>{" "}
            <span
              style={{
                color:
                  allMoneys.filter(
                    (m) => m.id === form.getValues("transferTo"),
                  )[0].color ?? "",
              }}
            >
              {
                allMoneys.filter(
                  (m) => m.id === form.getValues("transferTo"),
                )[0].name
              }{" "}
              (
              <span className="font-readex">
                {UseAmountFormat(
                  Number(form.watch("transferAmount") ?? 0) +
                    Number(
                      allMoneys.filter(
                        (m) => m.id === form.getValues("transferTo"),
                      )[0].amount,
                    ),
                  { hide: listState.hideAmounts, sign: true },
                )}
              </span>
              )
            </span>
          </div>
        )}
        {form.watch("transferTo") && (
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Reason for transferring"
                    data-vaul-no-drag
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            onClick={() => close()}
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
