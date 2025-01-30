// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'

test('Spinner renders correctly when on={true}', () => {
  render(<Spinner on={true} />)
  const spinner = screen.getByText(/please wait/i)
  expect(spinner).toBeInTheDocument()
})

test('Spinner does not render when on={false}', () => {
  render(<Spinner on={false} />)
  const spinner = screen.queryByText(/please wait/i)
  expect(spinner).not.toBeInTheDocument()
})

test('Spinner has correct ID and structure', () => {
  render(<Spinner on={true} />)
  const spinnerDiv = document.getElementById('spinner')
  expect(spinnerDiv).toBeInTheDocument()
  expect(spinnerDiv.querySelector('h3')).toBeInTheDocument()
})

test('Spinner requires the on prop', () => {
  // Spy on console.error
  const consoleSpy = jest.spyOn(console, 'error')
  render(<Spinner />)
  expect(consoleSpy).toHaveBeenCalled()
  consoleSpy.mockRestore()
})