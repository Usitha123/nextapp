import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Orders from '../../../../app/Canteendashboard/Orders/page';
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
vi.mock('../../../../app/Canteendashboard/Orders/Orderslist', () => ({
  default: () => <div>Mocked Orderslist</div>,
}));

describe('Canteendashboard Orders Page', () => {
  test('renders the orders page correctly', () => {
    render(
      <SessionProvider session={null}>
        <Orders />
      </SessionProvider>
    );

    expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Header Orders')).toBeInTheDocument();
    expect(screen.getByText('Mocked Orderslist')).toBeInTheDocument();
  });
});
