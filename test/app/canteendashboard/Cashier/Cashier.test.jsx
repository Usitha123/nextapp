import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Cashier from '../../../../app/Canteendashboard/Cashier/page'
import { SessionProvider } from 'next-auth/react';

vi.mock('next-auth/react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useSession: vi.fn(() => ({
        data: { user: { name: 'User', email: 'user@example.com' } },
        status: 'authenticated',
      })),
      SessionProvider: ({ children }) => <>{children}</>,
    };
  });

vi.mock('../../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>Mocked Header {title}</div>,
}));
vi.mock('../../../../app/Canteendashboard/Cashier/Addowner', () => ({
    default: () => <div>Mocked Cashier</div>,
}));

describe('Canteendashboard Cashier Page', () => {

    test('renders the cashier page correctly', () => {
        render(<Cashier />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Add Cashier')).toBeInTheDocument();
        expect(screen.getByText('Mocked Cashier')).toBeInTheDocument();
    });

});