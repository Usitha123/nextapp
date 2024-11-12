import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Sidebar from '../../../../app/Canteendashboard/Sidebar/page'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));
vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

describe('Canteendashboard Sidebar', () => {
    beforeEach(() => {
        useRouter.mockReturnValue({
            push: vi.fn(),
        });
    })
    test('renders the sidebar components correctly', () => {
        render(<Sidebar />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LOGO');

        expect(screen.getByText('LOGO')).toBeInTheDocument();
        expect(screen.getByText('Canteen Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Meals')).toBeInTheDocument();
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Cashier')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('calls signOut when the logout button is clicked', async () => {
        render(<Sidebar />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /Logout/i }));

        expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
});