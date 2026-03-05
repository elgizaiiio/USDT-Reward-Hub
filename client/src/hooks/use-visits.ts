import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertVisit } from "@shared/schema";

export function useRecordVisit() {
  return useMutation({
    mutationFn: async (data: InsertVisit = {}) => {
      const res = await fetch(api.visits.create.path, {
        method: api.visits.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to record visit");
      return api.visits.create.responses[201].parse(await res.json());
    },
  });
}
