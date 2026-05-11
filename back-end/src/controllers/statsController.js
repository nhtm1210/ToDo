import Task from "../models/Task.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const toDayKey = (date) => date.toISOString().slice(0, 10);
const toMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getStats = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).lean();

    const totals = {
      all: tasks.length,
      active: tasks.filter((t) => t.status === "active").length,
      complete: tasks.filter((t) => t.status === "complete").length,
    };
    totals.completionRate =
      totals.all > 0 ? Math.round((totals.complete / totals.all) * 100) : 0;

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const byDayLast7 = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date(startOfToday.getTime() - (6 - i) * DAY_MS);
      const dayEnd = new Date(dayStart.getTime() + DAY_MS);
      return {
        date: toDayKey(dayStart),
        created: tasks.filter((t) => {
          const c = new Date(t.createdAt);
          return c >= dayStart && c < dayEnd;
        }).length,
        completed: tasks.filter((t) => {
          if (!t.completedAt) return false;
          const c = new Date(t.completedAt);
          return c >= dayStart && c < dayEnd;
        }).length,
      };
    });

    const byMonthLast6 = Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i),
        1
      );
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i) + 1,
        1
      );
      return {
        month: toMonthKey(monthStart),
        created: tasks.filter((t) => {
          const c = new Date(t.createdAt);
          return c >= monthStart && c < monthEnd;
        }).length,
        completed: tasks.filter((t) => {
          if (!t.completedAt) return false;
          const c = new Date(t.completedAt);
          return c >= monthStart && c < monthEnd;
        }).length,
      };
    });

    const completedDates = tasks
      .filter((t) => t.status === "complete" && t.completedAt)
      .map((t) => new Date(t.completedAt).getTime());
    const createdDates = tasks.map((t) => new Date(t.createdAt).getTime());

    const firstTaskAt =
      createdDates.length > 0 ? new Date(Math.min(...createdDates)) : null;
    const lastCompletedAt =
      completedDates.length > 0
        ? new Date(Math.max(...completedDates))
        : null;

    res.status(200).json({
      totals,
      byDayLast7,
      byMonthLast6,
      firstTaskAt,
      lastCompletedAt,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getStats", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
