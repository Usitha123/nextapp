import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Cashier from '../../../../app/Canteendashboard/Cashier/page'

vi.mock('../../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));

describe('Canteendashboard Cashier Page', () => {

    test('renders the cashier page correctly', () => {
        render(<Cashier />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level:1 })).toHaveTextContent('Cashier');
    });

});