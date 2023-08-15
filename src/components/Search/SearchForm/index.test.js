import { render, screen } from '@testing-library/react';
import SearchForm from './index';

describe('Unit test: Search form', () => {

    test('Test for rendering', () => {
        render(<SearchForm />);

        // Do some tests here  
          const testElement = screen.getByText(/Search for tour spots:/i);
          expect(testElement).toBeInTheDocument();
    });
});
