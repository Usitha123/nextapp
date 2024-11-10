import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Header from '../../../../app/Canteendashboard/Header/page'

describe('Canteendashboard Header', () => {

    test('renders the canteendashboard header title correctly', () => {
        const testTitle = 'Header Title';
        render(<Header title={testTitle} />);

        expect(screen.getByText(testTitle)).toBeInTheDocument();
    });

});