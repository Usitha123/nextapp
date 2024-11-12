import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Topbar from '../../../../app/Canteendashboard/Topbar/page'
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";

describe('Canteendashboard Topbar', () => {
    test('renders the topbar component correctly', () => {
        render(<Topbar />);
        expect(screen.getByText('Hi Dunith, Welcome Back')).toBeInTheDocument();
    });

});