import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Registerform from '../../../app/register/RegisterForm/page'
import { useRouter } from 'next/navigation';

describe('RegisterForm', () => {

    vi.mock('next/navigation', () => ({
        useRouter: vi.fn(),
    }));

    test('renders the registerform with all input fields and button correctly', () => {
        render(<Registerform />);

        expect(screen.getByRole('heading'), { name: /japura cms/i }).toBeInTheDocument();

        expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    /*test('show an error when fields are empty on form submission', async () => {
        render(<Registerform />);

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        const errorMessage = await screen.findByText(/all fields are required./i);
        expect(errorMessage).toBeInTheDocument();
    });*/

    /*test('shows an error when passwords do not match', async () => {
        render(<Registerform />);
        
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'wrongpassword' } });
        
        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        const errorMessage = await screen.findByText(/passwords do not match./i);
        expect(errorMessage).toBeInTheDocument();
    });*/

    test('check register form submit and navigates on successfully', async () => {
        const pushMock = vi.fn();
        useRouter.mockReturnValue({ push: pushMock });
        render(<Registerform />);

        global.fetch = vi.fn()
            .mockResolvedValueOnce({ json: vi.fn().mockResolvedValue({ user: null }) })
            .mockResolvedValueOnce({ ok: true });

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await screen.findByRole('button', { name: /register/i });

        expect(pushMock).toHaveBeenCalledWith('/');
    });

    test('show a server error message if registration fails', async () => {
        render(<Registerform />);

        global.fetch = vi.fn()
            .mockResolvedValueOnce({ json: vi.fn().mockResolvedValue({ user: null }) })
            .mockResolvedValueOnce({ ok: false });

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await screen.findByText('User registration failed.');
        expect(screen.getByText('User registration failed.')).toBeInTheDocument();
    });

    test('show a error when user already exists', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: true })
        });

        render(<Registerform />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/user already exists./i)).toBeInTheDocument();
        });

        vi.restoreAllMocks();
    });

    test('show an error message when a registration fails', async () => {

        vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
            throw new Error('Network error');
        });

        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<Registerform />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/an error occurred. please try again./i)).toBeInTheDocument();
        });

        expect(consoleErrorMock).toHaveBeenCalledWith('Error during registration:', expect.any(Error));

        vi.restoreAllMocks();
    });
})