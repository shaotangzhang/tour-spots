import { render, screen } from '@testing-library/react';
import GridItem from '.';

describe('Unit test: GridItem', () => {

    test('Test for rendering', () => {
        const xid = 'R285416';

        render(<GridItem item={xid} onLoad={function () {

            // Do some tests here  
            const testElement = screen.getByTestId(xid);
            expect(testElement).toBeInTheDocument();

        }} />);

    });
});
