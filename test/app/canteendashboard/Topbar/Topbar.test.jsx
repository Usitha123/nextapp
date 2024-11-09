import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Topbar from '../../../../app/Canteendashboard/Topbar/page'

describe('Canteendashboard Topbar', () => {

    test('renders the welcome message', () => {
        render(<Topbar />);
        expect(screen.getByText('Hi Dunith, Welcome Back')).toBeInTheDocument();
    });
    
    test('renders the topbar component correctly', () => {
        render(<Topbar />);
        expect(screen.getByText('⚙️')).toBeInTheDocument();
        expect(screen.getByText('👤')).toBeInTheDocument();
    });

});