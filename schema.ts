import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the original for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Destinations schema
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating"),
  tags: text("tags").array(),
  pricePerPerson: integer("price_per_person"),
  type: text("type"), // e.g., "Popular", "Trending", "Romantic"
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Activities schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(), // e.g., "2-3 hours"
  category: text("category").notNull(), // e.g., "Sightseeing", "Food & Dining", etc.
  imageUrl: text("image_url"),
  icon: text("icon").notNull(), // e.g., "building-2-line", "restaurant-line", etc.
  iconBg: text("icon_bg").notNull(), // Background color for the icon
  iconColor: text("icon_color").notNull(), // Color for the icon
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Trips schema
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(), 
  userId: integer("user_id"), // Optional, only for logged-in users
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  destination: text("destination").notNull(),
  travelers: integer("travelers").notNull(),
  itinerary: jsonb("itinerary").notNull(), // JSON array of day plans
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

// Day plan (used in the itinerary JSON)
export const dayPlanSchema = z.object({
  day: z.number(),
  date: z.string(),
  activities: z.array(
    z.object({
      activityId: z.number(),
      name: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      duration: z.string(),
    })
  ),
});

export type DayPlan = z.infer<typeof dayPlanSchema>;
