import { db } from "./db";
import { visits, type InsertVisit, type Visit } from "@shared/schema";

export interface IStorage {
  createVisit(visit: InsertVisit): Promise<Visit>;
}

export class DatabaseStorage implements IStorage {
  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const [visit] = await db.insert(visits).values(insertVisit).returning();
    return visit;
  }
}

export const storage = new DatabaseStorage();