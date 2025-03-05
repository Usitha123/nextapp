import { render, screen } from '@testing-library/react';
import { vi,describe, test, expect } from 'vitest';
import Logout from '../../../../app/Cashierdashboard/Logout/page'

vi.mock('../../../../app/Cashierdashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
  }));
  vi.mock('../../../../app/Cashierdashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
  }));
  vi.mock('../../../../app/Cashierdashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
  }));

describe('Cashierdashboard Logout', () => {

    test('renders the logout page correctly', () => {
      render(<Logout />);
      expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /logout/i })).toBeInTheDocument();
    });
  
});