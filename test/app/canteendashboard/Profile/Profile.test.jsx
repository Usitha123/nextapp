import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Profile from '../../../../app/Canteendashboard/Profile/page'

vi.mock('../../../../app/Canteendashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/Canteendashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../../app/Canteendashboard/Profile/Profile', () => ({
    default: () => <div>Mocked Profile</div>,
}));

describe('Canteendashboard Profile Page', () => {

    test('renders the Profile page correctly', () => {
        render(<Profile />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Mocked Profile')).toBeInTheDocument();
    });

});