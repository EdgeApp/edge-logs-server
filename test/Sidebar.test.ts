import { assert } from 'chai'
import mocha from 'mocha'

import { adjustDateToSelectedTimezone } from '../src/client/components/Sidebar'
import { fixture } from './fixtures'
const { describe, it } = mocha

describe('adjustDateToSelectedTimezone', () => {
  for (const testCase of fixture.adjustDateToSelectedTimezone) {
    it(testCase.testDescription, () => {
      // Arrange
      const inputDateStr = testCase.inputDateStr
      const inputTimezoneOffset = testCase.inputTimezoneOffset
      const expectedOutputDateStr = testCase.expectedOutputDateStr
      // Act
      const actualResult = adjustDateToSelectedTimezone(
        inputDateStr,
        inputTimezoneOffset
      )
      // Assert
      if (actualResult.toJSON() === null) {
        assert.equal(actualResult.toString(), expectedOutputDateStr)
      } else {
        assert.equal(actualResult.toJSON(), expectedOutputDateStr)
      }
    })
  }
})
