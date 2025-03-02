import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { vi } from "vitest";
import Registerform from "../../../app/register/RegisterForm/page";
import { useRouter } from "next/navigation";
import { toast,ToastContainer } from "react-toastify";

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock toast notifications
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("RegisterForm", () => {
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockReturnValue({ push });
  });

  test("renders the register form correctly", () => {
    render(<Registerform />);
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  /*test("shows validation messages for empty input fields", async () => {
    render(<Registerform />);

    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "" } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(toast.error).toHaveBeenCalledWith("All fields are required."); 
  });*/
  
  test("shows validation message for invalid phone number", async () => {
    render(<Registerform />);
    
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Akila" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Prabath" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "akila@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: "Computing" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
  
    expect(toast.error).toHaveBeenCalledWith("Phone number must be 10 digits.");
  });

  test("shows validation message for mismatched passwords", async () => {
    render(<Registerform />);

    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Akila" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Prabath" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "akila@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password456" } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: "Computing" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(toast.error).toHaveBeenCalledWith("Passwords do not match.");
  });

  test("redirects the user after successful registration", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/api/userExists")) {
        return Promise.resolve({ json: () => Promise.resolve({ user: null }) });
      }
      return Promise.resolve({ ok: true });
    });
  
    render(<Registerform />);
    
    fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: "Akila" },});
    fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: "Prabath" },});
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "akila@example.com" },});
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: "1234567890" },});
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: "password123" },});
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password123" },});
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Computing" },});
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Registration successful!");
    });
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/");
    });
  });
  
});
