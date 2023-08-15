import { render, screen } from '@testing-library/react';
import Home from './index';

describe('Unit test: Home page', () => {

    beforeAll(() => {
        
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {

    });

    test('Test for rendering', () => {
        render(<Home />);

        const labelElement = screen.getByTestId('Home page');
        expect(labelElement).toBeInTheDocument();
    });
});
