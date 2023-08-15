import { render, screen } from '@testing-library/react';
import GridItem from './index';

describe('Unit test: GridItem', () => {

    test('Test for rendering', () => {
        render(<GridItem />);

        // Do some tests here  
          const testElement = screen.getByTestId('Grid item');
          expect(testElement).toBeInTheDocument();
    });
});
