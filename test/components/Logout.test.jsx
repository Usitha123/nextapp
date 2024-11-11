import { render, screen, fireEvent } from '@testing-library/react';
import Logout from '../../components/Logout';
import { signOut, useSession } from 'next-auth/react';
import { vi } from 'vitest';

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
    signOut: vi.fn(),
}));

describe('Logout Component', () => {
    test('renders correctly when session is present', () => {
        useSession.mockReturnValue({
            data: {
                user: {
                    firstName: 'Akila',
                    lastName: 'Prabath',
                    email: 'akila.prabath@example.com',
                },
            },
            status: 'authenticated',
        });

        render(<Logout />);

        expect(screen.getByText((content, element) => {
            return content.includes('Name:') && element.querySelector('span')?.textContent === 'Akila Prabath';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return content.includes('Email:') && element.querySelector('span')?.textContent === 'akila.prabath@example.com';
        })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    test('renders correctly when no session is present', () => {
        useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

        render(<Logout />);
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Name: Guest';
        })).toBeInTheDocument();
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    });

    it('calls signOut when Log Out button is clicked', () => {
        useSession.mockReturnValue({
            data: {
                user: {
                    firstName: 'Akila',
                    lastName: 'Prabath',
                    email: 'akila.prabath@example.com',
                },
            },
            status: 'authenticated',
        });

        render(<Logout />);

        const logoutButton = screen.getByRole('button', { name: /log out/i });
        fireEvent.click(logoutButton);

        expect(signOut).toHaveBeenCalled();
    });
});
