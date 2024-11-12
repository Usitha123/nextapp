import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Reportspage from '../../../../app/admindashboard/Reports_/page'

vi.mock('../../../../app/admindashboard/Sidebar/page', () => ({
    default: () => <div>Mocked Sidebar</div>,
}));
vi.mock('../../../../app/admindashboard/Topbar/page', () => ({
    default: () => <div>Mocked Topbar</div>,
}));
vi.mock('../../../../app/admindashboard/Header/page', () => ({
    default: ({ title }) => <div>{title}</div>,
}));
vi.mock('../../../../app/admindashboard/Reports_/ReportGenerate', () => ({
    default: () => <div>Mocked ReportGenerate</div>,
}));

describe('Admindashboard Reports Page', () => {
    test('renders the reports page correctly', () => {
        render(<Reportspage />);
        expect(screen.getByText('Mocked Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Mocked Topbar')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Mocked ReportGenerate')).toBeInTheDocument();
    });

});