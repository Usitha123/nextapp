import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Profilepage from '../../../../app/Cashierdashboard/Profile/Edit/page'

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

vi.mock('../../../../app/Cashierdashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Header/page', () => ({
    default: ({ title }) => <div>Mocked Header {title}</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Profile/Edit/Profile', () => ({
    default: () => <div>Mocked Profile</div>,
}));

describe('Cashierdashboard Profile Page', () => {

    test('renders the Profile page correctly', () => {
        render(<Profilepage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Profile')).toBeInTheDocument();
        expect(screen.getByText('Mocked Profile')).toBeInTheDocument();
    });

});