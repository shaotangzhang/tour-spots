import { render, screen } from '@testing-library/react';
import Register from './index';

describe('Unit test: Register', () => {

    test('Test for rendering', () => {
        render(<Register />);

        // Do some tests here  
          const testElement = screen.getByText(/User Registration/i);
          expect(testElement).toBeInTheDocument();
    });
});
