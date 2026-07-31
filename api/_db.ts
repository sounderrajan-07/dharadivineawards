import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Nomination from './_models/Nomination.js';
import Donation from './_models/Donation.js';
import Delegate from './_models/Delegate.js';
import Volunteer from './_models/Volunteer.js';
import Enquiry from './_models/Enquiry.js';
import Event from './_models/Event.js';
import Gallery from './_models/Gallery.js';
import SiteConfig from './_models/SiteConfig.js';
import ActivityLog from './_models/ActivityLog.js';
import News from './_models/News.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DatabaseSchema {
  nominations: any[];
  donations: any[];
  delegates: any[];
  volunteers: any[];
  enquiries: any[];
  activityLogs: any[];
  gallery: any[];
  events: any[];
  siteConfig: any[];
  news: any[];
}

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI environment variable is missing. Falling back to local db.json storage.");
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB Atlas successfully");
    return true;
  } catch (error) {
    console.error("MongoDB Atlas connection failed, falling back to local file:", error);
    return false;
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  const mongoAvailable = await connectMongo();

  if (mongoAvailable) {
    try {
      const [
        nominations,
        donations,
        delegates,
        volunteers,
        enquiries,
        activityLogs,
        gallery,
        events,
        siteConfig,
        news
      ] = await Promise.all([
        (Nomination as any).find({}).lean(),
        (Donation as any).find({}).lean(),
        (Delegate as any).find({}).lean(),
        (Volunteer as any).find({}).lean(),
        (Enquiry as any).find({}).lean(),
        (ActivityLog as any).find({}).lean(),
        (Gallery as any).find({}).lean(),
        (Event as any).find({}).lean(),
        (SiteConfig as any).find({}).lean(),
        (News as any).find({}).lean()
      ]);

      const totalDocs = nominations.length + donations.length + delegates.length + enquiries.length + gallery.length + news.length;
      if (totalDocs === 0) {
        console.log("MongoDB Atlas is empty. Auto-seeding initial data from db.json...");
        const fileData = await readLocalDbFile();
        await seedMongoFromLocal(fileData);
        return fileData;
      }

      // Migrate initial news if MongoDB news collection is empty
      let finalNews = news;
      if (!news || news.length === 0) {
        console.log("News database is empty. Auto-migrating initial news from db.json...");
        try {
          const fileData = await readLocalDbFile();
          if (fileData.news && fileData.news.length > 0) {
            await Promise.all(
              fileData.news.map((item: any) => (News as any).findOneAndUpdate({ id: item.id }, item, { upsert: true }))
            );
            console.log(`Successfully migrated ${fileData.news.length} news articles from db.json to MongoDB.`);
            finalNews = await (News as any).find({}).lean();
          }
        } catch (e) {
          console.error("Failed to migrate news from db.json:", e);
        }
      }

      let finalEvents = events;
      if (!events || events.length === 0) {
        console.log("Events database is empty. Auto-migrating initial events from db.json...");
        try {
          const fileData = await readLocalDbFile();
          if (fileData.events && fileData.events.length > 0) {
            await Promise.all(
              fileData.events.map((item: any) => (Event as any).findOneAndUpdate({ id: item.id }, item, { upsert: true }))
            );
            console.log(`Successfully migrated ${fileData.events.length} events from db.json to MongoDB.`);
            finalEvents = await (Event as any).find({}).lean();
          }
        } catch (e) {
          console.error("Failed to migrate events from db.json:", e);
        }
      }

      return {
        nominations,
        donations,
        delegates,
        volunteers,
        enquiries,
        activityLogs,
        gallery,
        events: finalEvents,
        siteConfig,
        news: finalNews
      };
    } catch (err) {
      console.error("Failed to read from MongoDB, trying local file fallback:", err);
    }
  }

  return await readLocalDbFile();
}

async function readLocalDbFile(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.nominations) parsed.nominations = [];
    if (!parsed.donations) parsed.donations = [];
    if (!parsed.delegates) parsed.delegates = [];
    if (!parsed.volunteers) parsed.volunteers = [];
    if (!parsed.enquiries) parsed.enquiries = [];
    if (!parsed.activityLogs) parsed.activityLogs = [];
    if (!parsed.gallery) parsed.gallery = [];
    if (!parsed.events) parsed.events = [];
    if (!parsed.siteConfig) parsed.siteConfig = [];
    if (!parsed.news) parsed.news = [];
    return parsed;
  } catch (error) {
    return {
      nominations: [],
      donations: [],
      delegates: [],
      volunteers: [],
      enquiries: [],
      activityLogs: [],
      gallery: [],
      events: [],
      siteConfig: [],
      news: []
    };
  }
}

async function seedMongoFromLocal(data: DatabaseSchema) {
  try {
    if (data.nominations?.length) await Nomination.insertMany(data.nominations, { ordered: false }).catch(() => {});
    if (data.donations?.length) await Donation.insertMany(data.donations, { ordered: false }).catch(() => {});
    if (data.delegates?.length) await Delegate.insertMany(data.delegates, { ordered: false }).catch(() => {});
    if (data.volunteers?.length) await Volunteer.insertMany(data.volunteers, { ordered: false }).catch(() => {});
    if (data.enquiries?.length) await Enquiry.insertMany(data.enquiries, { ordered: false }).catch(() => {});
    if (data.activityLogs?.length) await ActivityLog.insertMany(data.activityLogs, { ordered: false }).catch(() => {});
    if (data.gallery?.length) await Gallery.insertMany(data.gallery, { ordered: false }).catch(() => {});
    if (data.events?.length) await Event.insertMany(data.events, { ordered: false }).catch(() => {});
    if (data.siteConfig?.length) await SiteConfig.insertMany(data.siteConfig, { ordered: false }).catch(() => {});
    if (data.news?.length) await News.insertMany(data.news, { ordered: false }).catch(() => {});
    console.log("Auto-seeding to MongoDB Atlas completed!");
  } catch (err) {
    console.error("Error auto-seeding MongoDB:", err);
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  const mongoAvailable = await connectMongo();

  const nominations = data.nominations || [];
  const donations = data.donations || [];
  const delegates = data.delegates || [];
  const volunteers = data.volunteers || [];
  const enquiries = data.enquiries || [];
  const activityLogs = data.activityLogs || [];
  const gallery = data.gallery || [];
  const events = data.events || [];
  const siteConfig = data.siteConfig || [];
  const news = data.news || [];

  if (mongoAvailable) {
    try {
      // Collect IDs of current items to preserve
      const nominationIds = nominations.map(item => item.id);
      const donationIds = donations.map(item => item.id);
      const delegateIds = delegates.map(item => item.id);
      const volunteerIds = volunteers.map(item => item.id);
      const enquiryIds = enquiries.map(item => item.id);
      const activityLogIds = activityLogs.map(item => item.id);
      const galleryIds = gallery.map(item => item.id);
      const eventIds = events.map(item => item.id);
      const siteConfigIds = siteConfig.map(item => item.id);
      const newsIds = news.map(item => item.id);

      // Run deletions first
      await Promise.all([
        (Nomination as any).deleteMany({ id: { $nin: nominationIds } }),
        (Donation as any).deleteMany({ id: { $nin: donationIds } }),
        (Delegate as any).deleteMany({ id: { $nin: delegateIds } }),
        (Volunteer as any).deleteMany({ id: { $nin: volunteerIds } }),
        (Enquiry as any).deleteMany({ id: { $nin: enquiryIds } }),
        (ActivityLog as any).deleteMany({ id: { $nin: activityLogIds } }),
        (Gallery as any).deleteMany({ id: { $nin: galleryIds } }),
        (Event as any).deleteMany({ id: { $nin: eventIds } }),
        (SiteConfig as any).deleteMany({ id: { $nin: siteConfigIds } }),
        (News as any).deleteMany({ id: { $nin: newsIds } })
      ]);

      const stripId = (item: any) => {
        if (!item) return {};
        const { _id, __v, ...rest } = item;
        return rest;
      };

      // Run upserts second to avoid race conditions/conflicts (and strip immutable fields)
      await Promise.all([
        ...nominations.map(item => (Nomination as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...donations.map(item => (Donation as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...delegates.map(item => (Delegate as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...volunteers.map(item => (Volunteer as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...enquiries.map(item => (Enquiry as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...activityLogs.map(item => (ActivityLog as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...gallery.map(item => (Gallery as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...events.map(item => (Event as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...siteConfig.map(item => (SiteConfig as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true })),
        ...news.map(item => (News as any).findOneAndUpdate({ id: item.id }, stripId(item), { upsert: true }))
      ]);
      return;
    } catch (err) {
      console.error("Failed to write to MongoDB:", err);
    }
  }

  try {
    const serialized = {
      nominations,
      donations,
      delegates,
      volunteers,
      enquiries,
      activityLogs,
      gallery,
      events,
      siteConfig,
      news
    };
    await fs.writeFile(dbPath, JSON.stringify(serialized, null, 2), 'utf8');
  } catch (error) {
    console.warn("Database local write skipped (read-only filesystem or file write error):", error);
  }
}
