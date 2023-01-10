import { pipeline } from 'node:stream/promises';
import {createReadStream, createWriteStream} from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import axios from 'axios'
import csv from 'csv-parser'
import { Extract } from 'unzipper'

const ZIP_FILE_NAME = 'survey.zip'
const SURVEY_DIRECTORY = './survey'
const SURVEY_RESULTS_FILE = 'survey_results_public.csv'

async function downloadSurveyZip() {
  const responseStream = await axios({
    url: 'https://info.stackoverflowsolutions.com/rs/719-EMH-566/images/stack-overflow-developer-survey-2022.zip',
    method: 'get',
    responseType: 'stream'
  })
  
  await mkdir(SURVEY_DIRECTORY)
  await pipeline(responseStream.data, createWriteStream(`${SURVEY_DIRECTORY}/${ZIP_FILE_NAME}`))
}

async function unzipSurveyFile() {
  await pipeline(createReadStream(`${SURVEY_DIRECTORY}/${ZIP_FILE_NAME}`), Extract({ path: SURVEY_DIRECTORY }))
}

async function* processCount(stream) {
  const countryCountMap = new Map()
  for await (const chunk of stream) {
    countryCountMap.set(chunk.Country, (countryCountMap.get(chunk.Country) ?? 0) + 1)
  }
  yield countryCountMap
}

async function* printResult(stream) {
  for await (const chunk of stream) {
    // a and b are arrays containing the country and count. Example: ['United States of America', 13543]
    const orderedResult = Object.fromEntries([...chunk.entries()].sort((a, b) => b[1] - a[1]))
    console.log(orderedResult)
  }
}

async function processSurvey() {
  await pipeline(
    createReadStream(`${SURVEY_DIRECTORY}/${SURVEY_RESULTS_FILE}`),
    csv(),
    processCount,
    printResult
  )
}

async function removeFiles() {
  await rm(SURVEY_DIRECTORY, { recursive: true })
}

await downloadSurveyZip()
await unzipSurveyFile()
await processSurvey()
await removeFiles()
