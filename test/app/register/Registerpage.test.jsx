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
vi.mock('../../../app/register/RegisterForm/page', () => ({
    default: () => <div>Mocked RegisterForm</div>,
}));

describe("Register", () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
  
    test("redirects to /dashboard if session exists", async () => {
      getServerSession.mockResolvedValueOnce({ user: { name: "Akila Prabath" } });
  
      await Registerpage();
  
      expect(redirect).toHaveBeenCalledWith("/dashboard");
      expect(redirect).toHaveBeenCalledTimes(1);
    });
  });
