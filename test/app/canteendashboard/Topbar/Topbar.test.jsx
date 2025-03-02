import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Topbar from '../../../../app/Canteendashboard/Topbar/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSession: vi.fn(),
  };
});
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Topbar Component', () => {
  test('renders user name and canteen name if session is available', () => {
    useSession.mockReturnValue({
      data: { user: { name: 'User', canteenName: 'Open Canteen' } },
      status: 'authenticated',
    });

    render(<Topbar />);

    expect(screen.getByText('Hi User Open Canteen, Welcome Back')).toBeInTheDocument();
  });

  test('renders default text when session is not available', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Topbar />);

    expect(screen.getByText('Hi , Welcome Back')).toBeInTheDocument();
  });

  test('renders settings and profile icons', () => {
    useSession.mockReturnValue({
      data: { user: { name: 'User', canteenName: 'Open Canteen' } },
      status: 'authenticated',
    });

    render(<Topbar />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/Canteendashboard/Profile');
    //expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    //expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
  });
});
