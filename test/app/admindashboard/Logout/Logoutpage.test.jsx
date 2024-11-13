import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Logoutpage from '../../../../app/admindashboard/Logout/page'

vi.mock('../../../../app/admindashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/admindashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/admindashboard/Header/page', () => ({
    default: () => <div>Mocked Header</div>,
}));

describe('Admindashboard Logout Page', () => {
    test('renders the logout page correctly', () => {
        render(<Logoutpage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

});