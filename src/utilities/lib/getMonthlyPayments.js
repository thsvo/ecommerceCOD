import dayjs from "dayjs";

export const getMonthlyPayments = (payments) => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const filteredPayments = payments.filter((payment) => {
    const paymentDate = dayjs(payment.createdAt);
    return (
      paymentDate.month() === currentMonth && paymentDate.year() === currentYear
    );
  });

  const paymentsByDay = filteredPayments.reduce((acc, payment) => {
    const day = dayjs(payment.createdAt).format("YYYY-MM-DD");
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += payment.amount;
    return acc;
  }, {});

  return Object.entries(paymentsByDay).map(([date, totalAmount]) => ({
    date,
    totalAmount,
  }));
};
