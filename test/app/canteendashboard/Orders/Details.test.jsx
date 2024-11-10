import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Details from '../../../../app/Canteendashboard/Orders/details'

describe('Canteendashboard Order Details', () => {

    test('renders the order details page correctly', () => {
        render(<Details />);

        expect(screen.getByText('details')).toBeInTheDocument();
    });

});