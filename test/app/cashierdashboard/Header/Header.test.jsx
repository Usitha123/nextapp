import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Header from '../../../../app/Cashierdashboard/Header/Header'

describe('Cashierdashboard Header', () => {

    test('renders the canteendashboard header title correctly', () => {
        const testTitle = 'Header Title';
        render(<Header title={testTitle} />);

        expect(screen.getByText(testTitle)).toBeInTheDocument();
    });

});