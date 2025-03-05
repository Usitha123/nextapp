import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Addmeals from '../../../../../app/Canteendashboard/Meals/Addmeal/Addmeals'
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

vi.mock("../../../../../app/Canteendashboard/Meals/Addmeal/Addmeal", () => ({
    uploadImage: vi.fn(),
    submitMealData: vi.fn(),
}));
// Mock URL.createObjectURL to avoid errors in JSDOM
beforeAll(() => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('mocked-image-url');
  });
  
  afterAll(() => {
    vi.restoreAllMocks();
  });
describe('Canteendashboard Addmeals Page', () => {

    beforeEach(() => {
        useSession.mockReturnValue({ data: { user: { canteenName: "Test Canteen" } }, status: "authenticated" });
    });

    test('renders the canteendashboard addmeals page form inputs correctly', () => {
      render(<Addmeals />);

      expect(screen.getByText(/Meal Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText(/Price/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantity/i)).toBeInTheDocument();
      expect(screen.getByText(/Image/i)).toBeInTheDocument();
    });

    test("displays an alert if form is incomplete", async () => {
        window.alert = vi.fn();
        render(<Addmeals />);

        fireEvent.click(screen.getByText(/Add/i));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Please fill out all fields correctly.");
        });
    });

    /*test("submits form successfully when all fields are filled", async () => {
        window.alert = vi.fn();
        render(<Addmeals />);

        
        fireEvent.change(screen.getByLabel(/Meal Name/i), { target: { value: "Meal" } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "A delicious meal." } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: "5" } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Lunch" } });

        fireEvent.click(screen.getByText(/Add/i));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Meal added successfully!");
        });
    });*/

});