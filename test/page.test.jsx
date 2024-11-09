import { render, screen } from '@testing-library/react';
import { vi,describe, test, expect } from 'vitest';
import Page from '../app/Canteendashboard/Cashier/page';

vi.mock('../app/Canteendashboard/Sidebar/page', () => ({
  default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../app/Canteendashboard/Topbar/page', () => ({
  default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../app/Canteendashboard/Header/page', () => ({
  default: ({ title }) => <div>{title}</div>,
}));

describe('Cashier Page', () => {

  test('renders the page with all components correctly', () => {
    render(<Page />);
    expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cashier/i })).toBeInTheDocument();
  });

});
