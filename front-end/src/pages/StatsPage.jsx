import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Circle, ListTodo, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStats } from "@/hooks/useStats";

const StatBox = ({ icon: Icon, label, value, color }) => (
  <Card className="p-4 border-0 bg-gradient-card shadow-custom-md">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  </Card>
);

const Bar = ({ label, created, completed, max }) => {
  const createdPct = max > 0 ? (created / max) * 100 : 0;
  const completedPct = max > 0 ? (completed / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          <span className="text-info">{created}</span>
          {" / "}
          <span className="text-success">{completed}</span>
        </span>
      </div>
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-info/60 rounded-full transition-all"
          style={{ width: `${createdPct}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full bg-success rounded-full transition-all"
          style={{ width: `${completedPct}%` }}
        />
      </div>
    </div>
  );
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString() : "—";

const StatsPage = () => {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Đang tải thống kê...
      </div>
    );
  }
  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Lỗi tải thống kê
      </div>
    );
  }

  const dayMax = Math.max(
    1,
    ...stats.byDayLast7.flatMap((d) => [d.created, d.completed])
  );
  const monthMax = Math.max(
    1,
    ...stats.byMonthLast6.flatMap((d) => [d.created, d.completed])
  );

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-3xl p-6 mx-auto space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
              Thống kê
            </h1>
            <p className="text-sm text-muted-foreground">
              Tổng quan hoạt động của bạn
            </p>
          </div>

          {/* Tổng quan */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox
              icon={ListTodo}
              label="Tổng nhiệm vụ"
              value={stats.totals.all}
              color="bg-primary"
            />
            <StatBox
              icon={Circle}
              label="Đang làm"
              value={stats.totals.active}
              color="bg-info"
            />
            <StatBox
              icon={CheckCircle2}
              label="Hoàn thành"
              value={stats.totals.complete}
              color="bg-success"
            />
            <StatBox
              icon={TrendingUp}
              label="Tỷ lệ hoàn thành"
              value={`${stats.totals.completionRate}%`}
              color="bg-primary"
            />
          </div>

          {/* 7 ngày */}
          <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">7 ngày gần đây</h2>
              <div className="text-xs text-muted-foreground">
                <span className="text-info">tạo mới</span> /{" "}
                <span className="text-success">hoàn thành</span>
              </div>
            </div>
            <div className="space-y-3">
              {stats.byDayLast7.map((day) => (
                <Bar
                  key={day.date}
                  label={day.date}
                  created={day.created}
                  completed={day.completed}
                  max={dayMax}
                />
              ))}
            </div>
          </Card>

          {/* 6 tháng */}
          <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">6 tháng gần đây</h2>
              <div className="text-xs text-muted-foreground">
                <span className="text-info">tạo mới</span> /{" "}
                <span className="text-success">hoàn thành</span>
              </div>
            </div>
            <div className="space-y-3">
              {stats.byMonthLast6.map((m) => (
                <Bar
                  key={m.month}
                  label={m.month}
                  created={m.created}
                  completed={m.completed}
                  max={monthMax}
                />
              ))}
            </div>
          </Card>

          {/* Khác */}
          <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Nhiệm vụ đầu tiên</div>
                <div className="font-medium">
                  {formatDate(stats.firstTaskAt)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Lần hoàn thành gần nhất</div>
                <div className="font-medium">
                  {formatDate(stats.lastCompletedAt)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
