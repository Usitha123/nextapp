import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import LoginForm from '../../components/LoginForm';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
}));

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    console.error.mockRestore();
});

describe('LoginForm Component', () => {
    test('renders the loginform correctly', () => {
        render(<LoginForm />);
        //check the loginform heading  is present
        expect(screen.getByRole('heading'), { name: /japura cms/i }).toBeInTheDocument();
        //check if input fields and submit button are rendered
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    /*test('show validation message for empty input fields', () => {
        render(<LoginForm />);
        //click the submit button without filling in any fields
        const loginbutton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginbutton);
        //check if a validation warning is displayed
        expect(screen.getByText(/pleace fill out this field/i)).toBeInTheDocument();
        expect(screen.getByText(/pleace fill out this field/i)).toBeInTheDocument();
    });*/

    test('shows error message when login fails', async () => {
        signIn.mockResolvedValueOnce({ error: 'Invalid Credentials' });

        render(<LoginForm />);

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        //check the error message is appear
        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('navigates to UserView on successful login', async () => {
        const mockReplace = vi.fn();
        useRouter.mockReturnValue({ replace: mockReplace });

        signIn.mockResolvedValueOnce({ error: null });

        render(<LoginForm />);

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'correctpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('UserView');
        });
    });

    test('show a error message when a login fails', async () => {
        signIn.mockRejectedValueOnce(new Error('Network error'));

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'somepassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // console log or error message to appear
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Login error:', expect.any(Error));
        });
    });

})