import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Orderspage from '../../../../app/Cashierdashboard/Orders/page';
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

vi.mock('../../../../app/Cashierdashboard/Sidebar/page', () => ({
  default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Topbar/page', () => ({
  default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Header/page', () => ({
  default: ({ title }) => <div>Mocked Header {title}</div>,
}));
vi.mock('../../../../app/Cashierdashboard/Orders/Orderslist', () => ({
  default: () => <div>Mocked Orderslist</div>,
}));

describe('Cashierdashboard Orders Page', () => {
  test('renders the orders page correctly', () => {
    render(
      <SessionProvider session={null}>
        <Orderspage />
      </SessionProvider>
    );

    expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Header Orders')).toBeInTheDocument();
    expect(screen.getByText('Mocked Orderslist')).toBeInTheDocument();
  });
});
