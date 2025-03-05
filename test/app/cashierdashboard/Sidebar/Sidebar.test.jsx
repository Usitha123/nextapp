import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Sidebar from '../../../../app/Cashierdashboard/Sidebar/page'
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
}));
vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

describe('Cashierdashboard Sidebar', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    test('renders the sidebar components correctly', () => {
        usePathname.mockReturnValue("/Cashierdashboard");
        render(<Sidebar />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LOGO');
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('calls signOut when the logout button is clicked', async () => {
        usePathname.mockReturnValue("/Cashierdashboard");
        render(<Sidebar />);
        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
        expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });

});