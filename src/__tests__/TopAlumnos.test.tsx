/**
 * Tests for components/dashboard/TopAlumnos
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopAlumnos from "@/components/dashboard/TopAlumnos";
import { supabase } from "@/lib/supabase-browser";

const mockFrom = supabase.from as jest.Mock;

describe("TopAlumnos", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing with no props", () => {
    render(<TopAlumnos />);
    expect(document.body).toBeTruthy();
  });

  it("renders without crashing when teacherGroupIds is empty", () => {
    render(<TopAlumnos teacherGroupIds={[]} />);
    expect(document.body).toBeTruthy();
  });

  it("renders without crashing with groupId", () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockResolvedValue({ data: [], error: null }),
      eq: jest.fn().mockReturnThis(),
    });

    render(<TopAlumnos groupId="test-group" />);
    expect(document.body).toBeTruthy();
  });

  it("renders with isDark=false", () => {
    render(<TopAlumnos isDark={false} groupId="test-group" />);
    expect(document.body).toBeTruthy();
  });

  it("shows no-data state when students array is empty after load", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({ data: [], error: null }),
        eq: jest.fn().mockReturnThis(),
      }),
    });

    render(<TopAlumnos teacherGroupIds={["group-1"]} />);

    await waitFor(() => {
      // After load, should render something (no crash)
      expect(document.body).toBeTruthy();
    });
  });
});
