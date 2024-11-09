import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Sidebar from '../../../../app/Canteendashboard/Sidebar/page'

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

describe('Canteendashboard Sidebar', () => {

    test('renders the sidebar components correctly', () => {
        render(<Sidebar />);
       
        expect(screen.getByRole('heading', { level:1 })).toHaveTextContent('LOGO');

        expect(screen.getByText('Canteen Dashboard').closest('a')).toHaveAttribute('href', '/Canteendashboard');
        expect(screen.getByText('Meals').closest('a')).toHaveAttribute('href', '/Canteendashboard/Meals');
        expect(screen.getByText('Orders').closest('a')).toHaveAttribute('href', '/Canteendashboard/Orders');
        expect(screen.getByText('Reports').closest('a')).toHaveAttribute('href', '/Canteendashboard/Reports_');
        expect(screen.getByText('Cashier').closest('a')).toHaveAttribute('href', '/Canteendashboard/Cashier');
        expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/Canteendashboard/Profile');
        expect(screen.getByText('Logout').closest('a')).toHaveAttribute('href', '/Canteendashboard/Logout');
    });

});