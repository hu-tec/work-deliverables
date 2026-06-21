import { describe, expect, it } from "vitest";
import { formRows, templates, cartItems } from "@/lib/fixtures";

describe("2025 route fixtures", () => {
  it("keeps form management seed data available", () => {
    expect(formRows).toHaveLength(3);
    expect(formRows[0].name).toContain("문서번역");
  });

  it("supports template and checkout flows", () => {
    expect(templates[0].price).toBe(220000);
    expect(cartItems.filter((item) => item.selected)).toHaveLength(2);
  });
});
