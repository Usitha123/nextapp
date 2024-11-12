import { render, screen } from '@testing-library/react';
import Registerpage from '../../../app/register/page';
import { vi } from 'vitest';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

describe('Register Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render RegisterForm when there is no session', async () => {
        getServerSession.mockResolvedValueOnce(null);

        render(<Registerpage />);
        expect(await screen.findByRole('form')).toBeInTheDocument();
    });

    test('should redirect to /dashboard when there is a session', async () => {
        getServerSession.mockResolvedValueOnce({ user: { name: 'John Doe' } });

        render(<Registerpage />);
        expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
});
