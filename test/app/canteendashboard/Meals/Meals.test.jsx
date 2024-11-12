import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Meals from '../../../../app/Canteendashboard/Meals/page'

vi.mock('../../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../../app/Canteendashboard/Meals/Mealslist', () => ({
    default: () => <div>Mocked Mealslist</div>,
}));

describe('Canteendashboard Meals Page', () => {

    test('renders the canteendashboard meals page correctly', () => {
        render(<Meals />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Meals')).toBeInTheDocument();
        expect(screen.getByText('Mocked Mealslist')).toBeInTheDocument();
    });

});