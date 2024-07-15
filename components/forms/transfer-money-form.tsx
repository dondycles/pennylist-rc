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

const TansferMoneySchema = z.object({
  transferAmount: z.string().optional(),
  transferTo: z.string(),
});

export default function TransferMoneyForm({
  close,
  money,
  currentTotal,
  allMoneys,
}: {
  close: () => void;
  money: Omit<MoneyTypes, "list">;
  currentTotal: string;
  allMoneys: Omit<MoneyTypes, "list">[];
}) {
  const listState = useListState();
  const form = useForm<z.infer<typeof TansferMoneySchema>>({
    resolver: zodResolver(TansferMoneySchema),
    defaultValues: {
      transferAmount: "",
      transferTo: "",
    },
  });

  const { mutate: mutateMoney, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof TansferMoneySchema>) => {
      const oldToMoneyData = allMoneys.filter(
        (m) => m.id === values.transferTo,
      )[0];

      const from = {
        updatedMoneyData: {
          ...money,
          amount:
            Number(money.amount ?? 0) - Number(values.transferAmount ?? 0),
        },
        oldMoneyData: money,
        currentTotal: currentTotal,
      };
      const to = {
        updatedMoneyData: {
          ...oldToMoneyData,
          amount:
            Number(oldToMoneyData.amount ?? 0) +
            Number(values.transferAmount ?? 0),
        },
        oldMoneyData: oldToMoneyData,
        currentTotal: currentTotal,
      };

      const { error } = await transferMoney({ ...from }, { ...to });

      if (error) {
        return form.setError("transferTo", { message: error });
      }
      close();
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
