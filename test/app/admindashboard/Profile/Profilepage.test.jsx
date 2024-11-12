import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Profilepage from '../../../../app/admindashboard/Profile/page'

vi.mock('../../../../app/admindashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/admindashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/admindashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../../app/admindashboard/Profile/Profile', () => ({
    default: () => <div>Mocked Profile</div>,
}));

describe('Admindashboard Profile Page', () => {
    test('renders the profile page correctly', () => {
        render(<Profilepage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Mocked Profile')).toBeInTheDocument();
    });

});