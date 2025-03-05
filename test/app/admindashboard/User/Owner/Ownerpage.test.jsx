import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Ownerpage from '../../../../../app/admindashboard/User/Student/page'

vi.mock('../../../../../app/admindashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../../app/admindashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../../app/admindashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../../../app/admindashboard/User/Student/Userdetails', () => ({
    default: () => <div>Mocked Userdetails</div>,
}));

describe('Admindashboard Owner Page', () => {
    test('renders the owner page correctly', () => {
        render(<Ownerpage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Userdetails')).toBeInTheDocument();
    });

});