import { render, screen } from '@testing-library/react';
import Openpage from '../../../../../app/UserView/Canteens/open/page'

describe('Userview Open Canteen Page', () => {
    test('renders the open canteen page correctly', () => {
        render(<Openpage />);
        expect(screen.getByText('Hello this is open canteen')).toBeInTheDocument();
    });
});