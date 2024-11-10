import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Canteendashboardpage from '../../../app/Canteendashboard/page'

vi.mock('../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));

describe('Canteendashboard Page', () => {

    test('renders the canteendashboard page correctly', () => {
        render(<Canteendashboardpage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Canteen Dashboard')).toBeInTheDocument();
    });

});