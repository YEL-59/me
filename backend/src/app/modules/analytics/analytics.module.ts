import { createHash } from 'crypto';
import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

type TAnalyticsDay = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
};

type TAnalyticsVisitor = {
  date: string;
  visitorKey: string;
};

const daySchema = new Schema<TAnalyticsDay>(
  {
    date: { type: String, required: true, unique: true, index: true },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const visitorSchema = new Schema<TAnalyticsVisitor>(
  {
    date: { type: String, required: true },
    visitorKey: { type: String, required: true },
  },
  { timestamps: true },
);

visitorSchema.index({ date: 1, visitorKey: 1 }, { unique: true });

const AnalyticsDay = model<TAnalyticsDay>('AnalyticsDay', daySchema);
const AnalyticsVisitor = model<TAnalyticsVisitor>(
  'AnalyticsVisitor',
  visitorSchema,
);

const DAY_TZ = 'Asia/Dhaka';

function dateKey(d = new Date(), timeZone = DAY_TZ) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function shiftDateKey(key: string, days: number) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function hashVisitor(raw: string) {
  return createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

const hitSchema = z.object({
  body: z.object({
    visitorId: z.string().min(8).max(128),
    path: z.string().max(300).optional(),
  }),
});

const router = Router();

/** Public: record a page view (unique visitor counted once per day) */
router.post(
  '/hit',
  validateRequest(hitSchema),
  catchAsync(async (req: Request, res: Response) => {
    const path = String(req.body.path ?? '/');
    if (path.startsWith('/dashboard')) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Dashboard traffic ignored',
        data: { counted: false },
      });
      return;
    }

    const date = dateKey();
    const visitorKey = hashVisitor(String(req.body.visitorId));

    await AnalyticsDay.findOneAndUpdate(
      { date },
      { $inc: { pageViews: 1 }, $setOnInsert: { uniqueVisitors: 0 } },
      { upsert: true, new: true },
    );

    let isNewVisitor = false;
    try {
      await AnalyticsVisitor.create({ date, visitorKey });
      isNewVisitor = true;
      await AnalyticsDay.findOneAndUpdate(
        { date },
        { $inc: { uniqueVisitors: 1 } },
      );
    } catch {
      // duplicate unique visitor for today — ignore
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Visit recorded',
      data: { counted: true, date, isNewVisitor },
    });
  }),
);

/** Dashboard: daily visitor summary */
router.get(
  '/summary',
  dashboardAuth,
  catchAsync(async (req: Request, res: Response) => {
    const days = Math.min(
      Math.max(Number(req.query.days) || 30, 7),
      90,
    );
    const today = dateKey();
    const from = shiftDateKey(today, -(days - 1));

    const rows = await AnalyticsDay.find({
      date: { $gte: from, $lte: today },
    })
      .sort({ date: -1 })
      .lean();

    const byDate = new Map(rows.map((r) => [r.date, r]));
    const daily = Array.from({ length: days }, (_, i) => {
      const date = shiftDateKey(today, -i);
      const row = byDate.get(date);
      return {
        date,
        pageViews: row?.pageViews ?? 0,
        uniqueVisitors: row?.uniqueVisitors ?? 0,
      };
    });

    const todayRow = daily[0];
    const yesterdayRow = daily[1] ?? {
      date: shiftDateKey(today, -1),
      pageViews: 0,
      uniqueVisitors: 0,
    };

    const last7 = daily.slice(0, 7);
    const sum = (list: typeof daily) =>
      list.reduce(
        (acc, d) => ({
          pageViews: acc.pageViews + d.pageViews,
          uniqueVisitors: acc.uniqueVisitors + d.uniqueVisitors,
        }),
        { pageViews: 0, uniqueVisitors: 0 },
      );

    const allTime = await AnalyticsDay.aggregate<{
      pageViews: number;
      uniqueVisitors: number;
    }>([
      {
        $group: {
          _id: null,
          pageViews: { $sum: '$pageViews' },
          uniqueVisitors: { $sum: '$uniqueVisitors' },
        },
      },
    ]);

    const peak = daily.reduce(
      (best, d) => (d.uniqueVisitors > best.uniqueVisitors ? d : best),
      daily[0],
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Analytics summary retrieved',
      data: {
        timezone: DAY_TZ,
        today: todayRow,
        yesterday: yesterdayRow,
        last7Days: last7,
        last7Totals: sum(last7),
        daily,
        rangeTotals: sum(daily),
        allTime: {
          pageViews: allTime[0]?.pageViews ?? 0,
          uniqueVisitors: allTime[0]?.uniqueVisitors ?? 0,
        },
        peakDay: peak,
      },
    });
  }),
);

export const AnalyticsRoutes = router;
