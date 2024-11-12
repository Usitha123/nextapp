import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Header from '../../../../app/UserView/Header/page'

describe('Userview Header', () => {
    test('should render the title prop correctly', () => {
        const title = "";
        render(<Header title={title} />);
        const headerElement = screen.getByRole('banner');
        expect(headerElement).toHaveTextContent(title);
    });
});