export const fixture = {
  adjustDateToSelectedTimezone: [
    {
      testDescription:
        'Returns a date for a valid date string, and a valid timezone offset of 0',
      inputDateStr: '5/24/2021, 12:01:49 PM',
      inputTimezoneOffset: 0,
      expectedOutputDateStr: '2021-05-24T12:01:49.000Z'
    },
    {
      testDescription:
        'Returns a date for a valid date string, and a valid timezone offset of -7',
      inputDateStr: '5/24/2021, 3:01:49 AM',
      inputTimezoneOffset: 0,
      expectedOutputDateStr: '2021-05-24T10:01:49.000Z'
    },
    {
      testDescription:
        'Returns an invalid date instance for an input string of hello world, but a valid timezone offset',
      inputDateStr: 'hello world',
      inputTimezoneOffset: -7,
      expectedOutputDateStr: 'Invalid Date'
    }
  ]
}
