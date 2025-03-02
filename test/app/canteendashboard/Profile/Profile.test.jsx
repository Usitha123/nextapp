import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Profile from '../../../../app/Canteendashboard/Profile/Edit/page'

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
vi.mock('../../../../app/Canteendashboard/Profile/Edit/Profile', () => ({
    default: () => <div>Mocked Profile</div>,
}));

describe('Canteendashboard Profile Page', () => {

    test('renders the Profile page correctly', () => {
        render(<Profile />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Profile')).toBeInTheDocument();
        expect(screen.getByText('Mocked Profile')).toBeInTheDocument();
    });

});