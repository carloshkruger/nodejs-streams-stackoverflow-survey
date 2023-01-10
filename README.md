
# Node.js Streams StackOverflow Survey

This is an application that downloads the StackOverflow survey zip file (~110MB), extracts it, reads the CSV file, groups and counts the data by country, sorts the data and prints the final result to the console. And all of this is done using Streams.

## Final result printed on the console

```
{
  'United States of America': 13543,
  India: 6639,
  Germany: 5395,
  'United Kingdom of Great Britain and Northern Ireland': 4190,
  Canada: 2490,
  France: 2328,
  Brazil: 2109,
  ...
}
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/carloshkruger/nodejs-streams-stackoverflow-survey.git
```

Go to the project directory

```bash
  cd nodejs-streams-stackoverflow-survey
```

Install dependencies

```bash
  npm ci
```

Start the application

```bash
  npm run start
```

