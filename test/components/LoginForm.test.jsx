import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginForm from "../../components/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Checking the LoginForm component", () => {
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockReturnValue({ push });
  });

  test("renders the loginform correctly", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows the user to type in email and password fields", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("shows an error message on failed login", async () => {
    signIn.mockResolvedValue({ error: "Invalid credentials" });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "wrong@example.com" }
    ,});
    fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: "wrongpassword" }
    ,});
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("redirects the user based on role after successful login", async () => {
    signIn.mockResolvedValue({ error: null });
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { role: "admin" } }),
      })
    );
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "admin" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/admindashboard");
    });
  });
});
