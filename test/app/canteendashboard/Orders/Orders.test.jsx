import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Orders from '../../../../app/Canteendashboard/Orders/page'

vi.mock('../../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>Mocked Header{title}</div>,
}));

describe('Canteendashboard Orders Page', () => {

    test('renders the orders page correctly', () => {
        render(<Orders />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
    });

});