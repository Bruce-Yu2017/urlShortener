import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {Main} from '../Main'
import validUrl from "valid-url";

describe('<Main />', () => {
  test('should load Main component', async () => {
    render(<Main />)
    await waitFor(() => screen.getAllByTestId('urlTable'))
    expect(screen.getByRole('heading')).toHaveTextContent('URL Shortener');
    expect(screen.getByRole('button')).toHaveAttribute('disabled');
  })

  test('should able to add text', async () => {
    const promise = Promise.resolve()
    const handleUpdateUsername = jest.fn(() => promise);
    const {getByTestId} = render(<Main update={handleUpdateUsername} />);
    const input = getByTestId('urlInput');
    expect(input.value).toBe('');
    fireEvent.change(input, {
      target: {
        value: "https://github.com/"
      }
    })
    waitFor(() => expect(input.value).toBe('https://github.com/'));
    await act(() => promise)
  })

  test('should detect invalid url format', async () => {
    const promise = Promise.resolve()
    const handleUpdateUsername = jest.fn(() => promise);
    const {getByTestId} = render(<Main update={handleUpdateUsername} />);
    const input = getByTestId('urlInput');
    fireEvent.change(input, {
      target: {
        value: "htt//dfsfsf"
      }
    })
    expect(validUrl.isUri(input.value)).toBeUndefined();
    await act(() => promise)
  })
})

