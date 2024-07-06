import { Database } from "@/database.types";
import { ListState } from "@/store";
var _ = require("lodash");

export const calculateListChartsData = ({
  logsLoading,
  logs,
  total,
  listState,
}: {
  logsLoading: boolean;
  logs: Database["public"]["Tables"]["logs"]["Row"][];
  total: number;
  listState: ListState;
}) => {
  const getDailyProgress = () => {
    if (logsLoading) return [];
    const groupedByDate: {
      [key: string]: {
        expenses: { amount: number; reason: string }[];
        gains: { amount: number; reason: string }[];
        date: string;
        expensesSum: number;
        gainsSum: number;
        gainOrLoss: number;
        currentTotal: number;
      };
    } = {};

    let arrayOfChanges: { amount: number; reason: string }[] = [];
    logs.toReversed().forEach((log) => {
      const changesInAmount =
        Number(log.changes?.to.amount) - Number(log.changes?.from.amount);

      const date = new Date(log.created_at).toDateString();
      if (!groupedByDate[date]) {
        arrayOfChanges = [];
      }
      arrayOfChanges.push({
        amount: changesInAmount ?? 0,
        reason: log.reason!,
      });
      const expensesMinusGain =
        _.sum(arrayOfChanges.map((a) => a.amount)) > 0
          ? null
          : _.sum(arrayOfChanges.map((a) => a.amount));
      const gainsMinusExpenses =
        _.sum(arrayOfChanges.map((a) => a.amount)) < 0
          ? null
          : _.sum(arrayOfChanges.map((a) => a.amount));
      groupedByDate[date] = {
        expenses: arrayOfChanges.filter((t) => t.amount !== 0 && t.amount < 0),
        gains: arrayOfChanges.filter((t) => t.amount !== 0 && t.amount > 0),
        date: date,
        expensesSum: _.sum(
          arrayOfChanges
            .filter((t) => t.amount !== 0 && t.amount < 0)
            .map((t) => t.amount),
        ),
        gainsSum: _.sum(
          arrayOfChanges
            .filter((t) => t.amount !== 0 && t.amount > 0)
            .map((t) => t.amount),
        ),
        gainOrLoss: expensesMinusGain ?? gainsMinusExpenses,
        currentTotal: Number(log.changes?.to.total),
      };
    });
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 365);
    let lastData: {
      expenses: {
        amount: number;
        reason: string;
      }[];
      gains: {
        amount: number;
        reason: string;
      }[];
      date: string;
      expensesSum: number;
      gainsSum: number;
      gainOrLoss: number;
      currentTotal: number;
    } = {
      expenses: [],
      gains: [],
      date: "",
      expensesSum: 0,
      gainsSum: 0,
      gainOrLoss: 0,
      currentTotal: 0,
    };

    const eachDayData: {
      expenses: {
        amount: number;
        reason: string;
      }[];
      gains: {
        amount: number;
        reason: string;
      }[];
      date: string;
      expensesSum: number;
      gainsSum: number;
      gainOrLoss: number;
      currentTotal: number;
    }[] = [];

    for (let i = 0; i <= 365; i++) {
      const day = currentDate.toDateString();
      if (groupedByDate[day] !== undefined) {
        // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
        lastData = groupedByDate[day];
      } else {
        // if no data, resets everything except total
        lastData.gainOrLoss = 0;
        lastData.expenses = [];
        lastData.gains = [];
        lastData.date = day;
        lastData.expensesSum = 0;
        lastData.gainsSum = 0;
      }
      eachDayData.push({ ...lastData });
      // sets the date to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayData;
  };

  const getMonthlyTotal = () => {
    if (logsLoading) return [];
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const groupedByMonth: { total: number; date: string }[] = [];

    if (listState.monthlyTotalBy === "last") {
      // iterated by the number of months

      // starts at +1 of the current month of last year
      let month = new Date().getMonth() + 1;
      for (let i = 0; i < 12; i++) {
        // if its the last month back to first month of the current year
        if (month === 12) month = 0;
        // get the last data of the month
        let monthsTotal;

        if (month <= new Date().getMonth()) {
          monthsTotal = getDailyProgress()?.findLast(
            (day) =>
              // gets data equal to month and year or last year at least
              new Date(day.date).getMonth() === month &&
              new Date(day.date).getFullYear() === year,
          );
        } else {
          monthsTotal = getDailyProgress()?.findLast(
            (day) =>
              // gets data equal to month and year or last year at least
              new Date(day.date).getMonth() === month &&
              new Date(day.date).getFullYear() === year - 1,
          );
        }

        // inserts the data to an object i or no. of month as the key
        groupedByMonth[i] = {
          // if the i is equal to current month, gets the current total instead for more accuracy
          total: i === month ? total : monthsTotal?.currentTotal!,
          date: monthsTotal?.date!,
        };

        month += 1;
      }
    }

    if (listState.monthlyTotalBy === "avg") {
      let average = [0];
      // starts at +1 of the current month of last year
      let month = new Date().getMonth() + 1;
      // iterated by the number of months
      for (let i = 0; i < 12; i++) {
        // if its the last month back to first month of the current year
        if (month === 12) month = 0;
        // gets the last Date
        let lastDay: string;

        if (month <= new Date().getMonth()) {
          getDailyProgress()
            .filter(
              (day) =>
                new Date(day.date).getMonth() === month &&
                new Date(day.date).getFullYear() === year,
            )
            .map((day) => {
              if (new Date(day.date).getDate() === 1) average = [0];
              // pushes each day total but resets if its the first day
              average.push(day.currentTotal);

              lastDay = day.date;
            });
        } else {
          getDailyProgress()
            .filter(
              (day) =>
                new Date(day.date).getMonth() === month &&
                new Date(day.date).getFullYear() === year - 1,
            )
            .map((day) => {
              if (new Date(day.date).getDate() === 1) average = [0];
              // pushes each day total but resets if its the first day
              average.push(day.currentTotal);

              lastDay = day.date;
            });
        }

        // sets the data for (i)month
        groupedByMonth[i] = {
          total: !isNaN(_.mean(average.filter((avg) => avg !== 0)))
            ? _.mean(average.filter((avg) => avg !== 0))
            : 0,
          date: lastDay!,
        };
        month += 1;
      }
    }
    const sortedByMonth: {
      total: number;
      date: string;
    }[] = [];
    groupedByMonth.forEach((monthData, i) => {
      if (new Date(monthData.date).getMonth() <= month) {
        sortedByMonth[i] = {
          total: monthData.total ?? 0,
          date: new Date(monthData.date).toDateString(),
        };
      } else {
        sortedByMonth[i] = {
          total: monthData.total ?? 0,
          date: new Date(monthData.date).toDateString(),
        };
      }
    });
    return sortedByMonth;
  };

  const getDifferences = () => {
    // Reverse the dailyTotal array once
    const reversedDailyTotal = getDailyProgress().toReversed();

    // Helper function to calculate the sum of totals over a given range
    const calculateSum = (start: number, end: number) => {
      return _.sum(
        getDailyProgress()
          .toReversed()
          .splice(start, end)
          .map((d) => d.currentTotal),
      );
    };

    // Calculate sums for each week range
    const sumCurrentWeek = calculateSum(0, 7);
    const sumCurrentTwoWeek = calculateSum(0, 14);
    const sumCurrentThreeWeek = calculateSum(0, 21);
    const sumCurrentFourWeek = calculateSum(0, 28);
    const sumCurrent365 = calculateSum(0, 365);
    const sumPastWeek = calculateSum(7, 7);
    const sumPastTwoWeek = calculateSum(14, 14);
    const sumPastThreeWeek = calculateSum(21, 21);
    const sumPastFourWeek = calculateSum(28, 28);
    const sumPast365 = calculateSum(365, 365);

    // Calculate percentage differences
    const calculatePercentageDifference = (current: number, past: number) => {
      return ((current - past) / current) * 100;
    };

    const yesterday = calculatePercentageDifference(
      total,
      reversedDailyTotal[1]?.currentTotal,
    );
    const week = calculatePercentageDifference(sumCurrentWeek, sumPastWeek);
    const twoWeek = calculatePercentageDifference(
      sumCurrentTwoWeek,
      sumPastTwoWeek,
    );
    const threeWeek = calculatePercentageDifference(
      sumCurrentThreeWeek,
      sumPastThreeWeek,
    );
    const fourWeek = calculatePercentageDifference(
      sumCurrentFourWeek,
      sumPastFourWeek,
    );

    const threeSixFive = calculatePercentageDifference(
      sumCurrent365,
      sumPast365,
    );

    const createDifferenceObject = (value: number) => {
      const numValue = isNaN(value) ? 0 : Number(value);
      return {
        value: `${numValue.toFixed(1)}%`,
        isUp: numValue > 0,
        isZero: numValue === 0,
      };
    };

    return {
      value: {
        yesterday: createDifferenceObject(yesterday).value,
        week: createDifferenceObject(week).value,
        twoWeek: createDifferenceObject(twoWeek).value,
        threeWeek: createDifferenceObject(threeWeek).value,
        fourWeek: createDifferenceObject(fourWeek).value,
        threeSixFive: createDifferenceObject(threeSixFive).value,
      },
      isUp: {
        yesterday: createDifferenceObject(yesterday).isUp,
        week: createDifferenceObject(week).isUp,
        twoWeek: createDifferenceObject(twoWeek).isUp,
        threeWeek: createDifferenceObject(threeWeek).isUp,
        fourWeek: createDifferenceObject(fourWeek).isUp,
        threeSixFive: createDifferenceObject(threeSixFive).isUp,
      },
      isZero: {
        yesterday: createDifferenceObject(yesterday).isZero,
        week: createDifferenceObject(week).isZero,
        twoWeek: createDifferenceObject(twoWeek).isZero,
        threeWeek: createDifferenceObject(threeWeek).isZero,
        fourWeek: createDifferenceObject(fourWeek).isZero,
        threeSixFive: createDifferenceObject(threeSixFive).isZero,
      },
    };
  };

  return {
    monthlyTotal: getMonthlyTotal(),
    differences: getDifferences(),
    dailyProgress: getDailyProgress(),
  };
};
