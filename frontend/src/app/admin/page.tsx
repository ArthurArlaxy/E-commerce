import { getDashboardInfo } from "@/actions/dashboard";
import SummaryStats from "@/components/Dashboard/SummaryStats";
import OrdersByStatus from "@/components/Dashboard/OrdersByStatus";
import TopProducts from "@/components/Dashboard/TopProducts";
import RevenueTrend from "@/components/Dashboard/RevenueTrend";
import { sumTotal, groupByDay } from "@/utils/format";
import styles from "./styles.module.css";

export default async function Page() {
  const data = await getDashboardInfo();

  if ("error" in data) {
    return (
      <div className={styles.page}>
        <p className={styles.errorMessage}>{data.error}</p>
      </div>
    );
  }

  const dailyRevenue = sumTotal(data.daily.dayOrders);
  const monthlyRevenue = sumTotal(data.monthly.monthOrders);
  const yearlyRevenue = sumTotal(data.yearly.yearOrders);

  const dailyTrend = groupByDay(data.monthly.monthOrders);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Painel de vendas</h1>
        <span className={styles.date}>{today}</span>
      </header>

      <SummaryStats
        daily={{
          label: "Hoje",
          revenue: dailyRevenue,
          ordersCount: data.daily.dayOrdersCount,
        }}
        monthly={{
          label: "Este mês",
          revenue: monthlyRevenue,
          ordersCount: data.monthly.monthOrdersCount,
        }}
        yearly={{
          label: "Este ano",
          revenue: yearlyRevenue,
          ordersCount: data.yearly.yearOrdersCount,
        }}
      />

      <RevenueTrend data={dailyTrend} />

      <div className={styles.splitGrid}>
        <OrdersByStatus data={data.ordersByStatus} />
        <TopProducts data={data.topProducts} />
      </div>
    </div>
  );
}