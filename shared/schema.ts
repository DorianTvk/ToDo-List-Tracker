import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    completed: true,
    dueDate: true,
  })
  .extend({
    title: z.string().min(1, "Task title is required").max(100, "Task title is too long"),
    dueDate: z.string().nullable(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;