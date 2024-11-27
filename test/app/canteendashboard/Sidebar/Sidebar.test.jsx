import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Sidebar from '../../../../app/Canteendashboard/Sidebar/page'
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
}));
vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

describe('Canteendashboard Sidebar', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    test('renders the sidebar components correctly', () => {
        usePathname.mockReturnValue("/Canteendashboard");
        render(<Sidebar />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LOGO');

        expect(screen.getByText('Canteen Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Meals')).toBeInTheDocument();
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Cashier')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('calls signOut when the logout button is clicked', async () => {
        usePathname.mockReturnValue("/Canteendashboard");
        render(<Sidebar />);
        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
        expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
});