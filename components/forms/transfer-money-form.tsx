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
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { UseAmountFormat } from "@/lib/utils";
import { useListState } from "@/store";
import { EditMoneyType, TansferMoneySchema } from "@/lib/types";

export default function TransferMoneyForm({
  close,
  money,
  currentTotal,
  allMoneys,
}: {
  // eslint-disable-next-line no-unused-vars
  close: (ids?: { to: string; from: string }) => void;
  money: z.infer<typeof EditMoneyType>;
  currentTotal: number;
  allMoneys: z.infer<typeof EditMoneyType>[];
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

  const selectedMoneyDestination = allMoneys.findLast(
    (money) => money.id === form.watch("transferTo"),
  );

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
        className="flex flex-col gap-2 w-[320px] mx-auto text-muted-foreground  text-sm"
      >
        <p>Transferring:</p>
        <div
          style={{
            color: money.color ?? "",
            borderColor: money.color ?? "",
            backgroundColor: money.color ? money.color + 20 : "",
          }}
          className="flex p-2 rounded-md border justify-between"
        >
          <p className="truncate">{money.name}</p>
          <p className="font-readex">
            {UseAmountFormat(money.amount ?? 0, {
              hide: listState.hideAmounts,
              sign: true,
            })}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {form.watch("transferTo") && (
            <FormField
              control={form.control}
              name="transferAmount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Amount to transfer"
                      type="number"
                      data-vaul-no-drag
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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
        <p>To:</p>
        <FormField
          control={form.control}
          name="transferTo"
          render={({ field }) => (
            <FormItem className="w-full ">
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    style={{
                      color: selectedMoneyDestination?.color ?? "",
                      borderColor: selectedMoneyDestination?.color ?? "",
                      backgroundColor: selectedMoneyDestination?.color
                        ? selectedMoneyDestination?.color + 20
                        : "",
                    }}
                    className="grid grid-cols-[5fr,16px] gap-2"
                  >
                    {field.value && (
                      <div className="flex flex-row justify-between">
                        <p className="truncate">
                          {selectedMoneyDestination?.name}
                        </p>
                        <p className="font-readex">
                          {UseAmountFormat(
                            selectedMoneyDestination?.amount ?? 0,
                            { hide: listState.hideAmounts, sign: true },
                          )}
                        </p>
                      </div>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {allMoneys
                    .filter((m) => m.id !== money.id)
                    .map((m) => {
                      return (
                        <SelectItem
                          style={{ color: m.color ?? "" }}
                          key={m.id}
                          value={m.id}
                        >
                          <div className="flex gap-2">
                            <p className="truncate">{m.name}</p>
                            <p className="font-readex">
                              {UseAmountFormat(m.amount ?? 0, {
                                hide: listState.hideAmounts,
                                sign: true,
                              })}
                            </p>
                          </div>
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
          <>
            <p>Result: </p>
            <div
              style={{
                color: money.color ?? "",
                borderColor: money.color ?? "",
                backgroundColor: money.color ? money.color + 20 : "",
              }}
              className="flex p-2 rounded-md border justify-between"
            >
              <p className="truncate">{money.name}</p>
              <p className="font-readex">
                {UseAmountFormat(
                  Number(money.amount ?? 0) -
                    Number(form.watch("transferAmount") ?? 0),
                  {
                    hide: listState.hideAmounts,
                    sign: true,
                  },
                )}
              </p>
            </div>
            <div
              style={{
                color: selectedMoneyDestination?.color ?? "",
                borderColor: selectedMoneyDestination?.color ?? "",
                backgroundColor: selectedMoneyDestination?.color
                  ? selectedMoneyDestination?.color + 20
                  : "",
              }}
              className="flex flex-row justify-between p-2 rounded-md border"
            >
              <p className="truncate">
                {
                  allMoneys.findLast(
                    (money) => money.id === form.watch("transferTo"),
                  )?.name
                }
              </p>
              <p className="font-readex">
                {UseAmountFormat(
                  Number(selectedMoneyDestination?.amount ?? 0) +
                    Number(form.watch("transferAmount") ?? 0),
                  { hide: listState.hideAmounts, sign: true },
                )}
              </p>
            </div>
          </>
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
