import { Database } from "@/database.types";
import { ListState } from "@/store";
var _ = require("lodash");
export type Progress = {
  expenses: { amount: number; reason: string; date: string }[];
  gains: { amount: number; reason: string; date: string }[];
  date: string;
  expensesSum: number;
  gainsSum: number;
  gainOrLoss: number;
  currentTotal: number;
};
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
    // all data will be coming from logs, since logs has all the movements in money

    // group each log by date, to also handle multiple logs in a single date.
    const groupedByDate: {
      [key: string]: Progress;
    } = {};

    // a temporary array for multiple logs in a single date
    let arrayOfLogsInASingleDate: {
      amount: number;
      reason: string;
      date: string;
    }[] = [];

    logs.toReversed().forEach((log) => {
      //each log has a record of changes in a money, so it will be stored here for later use
      const changesInAmount =
        Number(log.changes?.to.amount) - Number(log.changes?.from.amount);

      const date = new Date(log.created_at).toDateString();

      // checks if this date has no data
      // if false, this means that this date is different from the previous iteration
      if (!groupedByDate[date]) {
        // clears the temporary array so that it can be filled up again by this date
        arrayOfLogsInASingleDate = [];
      }
      // then, pushes the data of the current log
      // if the previous iteration's date is similar to current, it just adds the data so it will become multiple logs for a single date
      arrayOfLogsInASingleDate.push({
        amount: changesInAmount ?? 0,
        reason: log.reason!,
        date: new Date(log.created_at).toDateString(),
      });

      // gets all the expenses by filtering only the negative values
      const expenses = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount < 0,
      );
      // gets all the expenses by filtering only the positive values
      const gains = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount > 0,
      );

      const expensesSum = _.sum(expenses.map((t) => t.amount));
      const gainsSum = _.sum(gains.map((t) => t.amount));

      // this sums up the changes happened in this date. ex. (100 + -100 + -25)
      // summing up all the positive and negative values
      // if negative, then there is a loss since loss are more than gains
      // if positive, then there is a gain since gains are more than loss
      const gainOrLoss = _.sum(arrayOfLogsInASingleDate.map((a) => a.amount));

      // saves the current date single/multiple logs.
      // if current date has an existing data, it just gets the current data of the tempory array
      groupedByDate[date] = {
        expenses,
        gains,
        date: date,
        expensesSum,
        gainsSum,
        gainOrLoss,
        // currentTotal will always get the very last record in each day
        currentTotal: Number(log.changes?.to.total),
      };
    });

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 365);
    let previousProgress: Progress = {
      expenses: [],
      gains: [],
      date: "",
      expensesSum: 0,
      gainsSum: 0,
      gainOrLoss: 0,
      currentTotal: 0,
    };

    const eachDayData: Progress[] = [];

    for (let i = 0; i <= 365; i++) {
      const day = currentDate.toDateString();
      if (groupedByDate[day] !== undefined) {
        // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
        previousProgress = groupedByDate[day];
      } else {
        // if no data, resets everything except total
        previousProgress.gainOrLoss = 0;
        previousProgress.expenses = [];
        previousProgress.gains = [];
        previousProgress.date = day;
        previousProgress.expensesSum = 0;
        previousProgress.gainsSum = 0;
      }
      eachDayData.push({ ...previousProgress });
      // sets the date to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayData;
  };

  const getMonthlyTotal = () => {
    if (logsLoading) return [];
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const dailyProgress = getDailyProgress();
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
          monthsTotal = dailyProgress?.findLast(
            (day) =>
              // gets data equal to month and year or last year at least
              new Date(day.date).getMonth() === month &&
              new Date(day.date).getFullYear() === year,
          );
        } else {
          monthsTotal = dailyProgress?.findLast(
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
          dailyProgress
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
          dailyProgress
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
    return groupedByMonth;
  };

  const getMonthlyProgress = () => {
    if (logsLoading) return [];
    const dailyProgress = getDailyProgress();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const groupedByMonth: Progress[] = [];

    {
      // iterated by the number of months

      // starts at +1 of the current month of last year
      let month = new Date().getMonth() + 1;
      for (let i = 0; i < 12; i++) {
        // if its the last month back to first month of the current year
        if (month === 12) month = 0;
        // get the last data of the month
        let monthProgress: Progress[] | undefined;

        // if the current iteration of month is more than the current month, sets it back last year
        if (month <= new Date().getMonth()) {
          monthProgress = dailyProgress?.filter(
            (day) =>
              // gets data equal to month and year or last year at least
              new Date(day.date).getMonth() === month &&
              new Date(day.date).getFullYear() === year,
          );
        } else {
          monthProgress = dailyProgress?.filter(
            (day) =>
              // gets data equal to month and year or last year at least
              new Date(day.date).getMonth() === month &&
              new Date(day.date).getFullYear() === year - 1,
          );
        }

        const monthDate = monthProgress.findLast((m) => m)?.date;
        const expenses = monthProgress.flatMap((m) => m.expenses);
        const gains = monthProgress.flatMap((m) => m.gains);
        const expensesSum = _.sum(expenses.map((e) => e.amount));
        const gainsSum = _.sum(gains.map((g) => g.amount));
        const gainOrLoss = _.add(gainsSum, expensesSum);
        const lastTotal = monthProgress
          .map((m) => m.currentTotal)
          .findLast((m) => m);
        console.log(lastTotal);
        // console.log("expensesSum: ", expensesSum);
        // console.log("gainsSum: ", gainsSum);

        // // inserts the data to an object i or no. of month as the key
        // groupedByMonth[i] = {
        //   // if the i is equal to current month, gets the current total instead for more accuracy
        //   currentTotal: i === month ? total : monthProgress?.!,
        //   date: monthProgress?.date!,
        // };

        groupedByMonth[i] = {
          currentTotal: lastTotal!,
          date: monthDate!,
          expenses,
          expensesSum,
          gainOrLoss,
          gains,
          gainsSum,
        };

        month += 1;
      }
    }

    return groupedByMonth;
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

  getMonthlyProgress();
  return {
    monthlyTotal: getMonthlyProgress(),
    differences: getDifferences(),
    dailyProgress: getDailyProgress(),
  };
};
