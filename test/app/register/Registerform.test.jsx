import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Registerform from '../../../app/register/RegisterForm/page'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { toast } from "react-toastify";

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
    ToastContainer: () => <div />,
}));

describe('RegisterForm', () => {

    test('renders the registerform with all input fields and button correctly', () => {
        render(<Registerform />);

        expect(screen.getByRole('heading'), { name: /japura cms/i }).toBeInTheDocument();

        expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    test('check user can select a faculty correctly', () => {
        render(<Registerform />);

        const facultySelect = screen.getByRole('combobox');
        expect(facultySelect.value).toBe('');
        fireEvent.change(facultySelect, { target: { value: 'Engineering' } });
        expect(facultySelect.value).toBe('Engineering');
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

        expect(await screen.findByText(/passwords do not match/i,)).toBeInTheDocument();
    });*/

    /*test('check register form submit and navigates on successfully', async () => {
        const pushMock = vi.fn();
        useRouter.mockReturnValue({ push: pushMock });
        render(<Registerform />);

        global.fetch = vi.fn()
            .mockResolvedValueOnce({ json: vi.fn().mockResolvedValue({ user: null }) })
            .mockResolvedValueOnce({ ok: true });

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await screen.findByRole('button', { name: /register/i });

        expect(pushMock).toHaveBeenCalledWith('/');
    });*/

    /*test('show a server error message if registration fails', async () => {
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
    });*/

    /*test('show a error when user already exists', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: true })
        });

        render(<Registerform />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0712345678' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText("User already exists.")).toBeInTheDocument();
        });

        vi.restoreAllMocks();
    });*/

    /*test('show an error message when a registration fails', async () => {

        vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
            throw new Error('Network error');
        });

        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<Registerform />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Akila' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Prabath' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'akila@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0712345678' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/an error occurred. please try again./i)).toBeInTheDocument();
        });

        expect(consoleErrorMock).toHaveBeenCalledWith('Error during registration:', expect.any(Error));

        vi.restoreAllMocks();
    });*/
})