import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    core.info('hello from workflow-runs action')
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
