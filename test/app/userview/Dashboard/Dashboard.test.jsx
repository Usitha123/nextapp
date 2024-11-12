import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Dashboard from '../../../../app/UserView/Dashboard/page'

describe('Userview Dashboard Page', () => {

    test('renders the dashboard page correctly', () => {
        render(<Dashboard/>);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

});