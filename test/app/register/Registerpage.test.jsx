import { render, screen } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import Registerpage from "@/app/register/page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

vi.mock("next-auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
vi.mock("@/app/register/RegisterForm/page", () => ({
  default: () => <div>Mocked RegisterForm</div>,
}));

describe("Register Page", () => {
  test("redirects to dashboard if session exists", async () => {
    getServerSession.mockResolvedValue({ user: { name: "User" } });

    await Registerpage();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  test("renders RegisterForm if no session exists", async () => {
    getServerSession.mockResolvedValue(null);

    render(await Registerpage());

    expect(screen.getByText("Mocked RegisterForm")).toBeInTheDocument();
  });
});
