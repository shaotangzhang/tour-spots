import { render, screen } from '@testing-library/react';
import User from './index';

describe('Unit test: User', () => {

    test('Test for rendering', () => {
        render(<User />);

        // Do some tests here  
          const testElement = screen.getByText(/Login/i);
          const userElement = screen.getByTestId('User page');
          expect(testElement || userElement).toBeInTheDocument();
    });
});
