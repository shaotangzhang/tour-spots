import { render, screen } from '@testing-library/react';
import MyComponent from './index';

describe('Unit test: ' + (MyComponent.constructor?.name || MyComponent.name), () => {

    beforeAll(() => {
        
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {

    });

    test('Test for rendering', () => {
        render(<MyComponent />);

        // Do some tests here  
        //   const linkElement = screen.getByText(/learn react/i);
        //   expect(linkElement).toBeInTheDocument();
    });
});
