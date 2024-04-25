import * as core from '@actions/core';
import { Octokit } from '@octokit/action';

const octokit = new Octokit();

export async function run(): Promise<void> {
  try {
    core.debug('hello from workflow-runs action');
    const inputGithubRepository = core.getInput('github-repository', {
      required: false,
    });
    const workflowRunStatus = core.getInput('workflow-run-status', {
      required: false,
    });
    const workflowRunCreatedRelativeHours = core.getInput(
      'workflow-run-created-hours-before',
      {
        required: false,
      },
    );
    const workflowRunBranch = core.getInput('workflow-run-branch', {
      required: false,
    });
    const workflowRunActor = core.getInput('workflow-run-actor', {
      required: false,
    });
    const githubRepository =
      inputGithubRepository === ''
        ? process.env.GITHUB_REPOSITORY!
        : inputGithubRepository;
    const [owner, repo] = githubRepository.split('/');
    const octoRequest = {
      owner,
      repo,
      status:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workflowRunStatus === '' ? undefined : (workflowRunStatus as any),
      created:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workflowRunCreatedRelativeHours === ''
          ? undefined
          : `<${getCreatedTimeString(workflowRunCreatedRelativeHours)}`,
      branch:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workflowRunBranch === '' ? undefined : (workflowRunBranch as any),
      actor:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workflowRunActor === '' ? undefined : (workflowRunActor as any),
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    core.info('Octokit request data ->');
    core.info(JSON.stringify(octoRequest, undefined, 2));
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runs',
      octoRequest,
    );
    core.debug('Output of GitHub API call ->');
    core.debug(JSON.stringify(response.data, undefined, 2));
    core.setOutput('runs-summary', JSON.stringify(response.data, undefined, 2));
    core.setOutput('runs-count', response.data.total_count);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

function getCreatedTimeString(hoursInput: string): string {
  const currentTimeMs = Date.now();
  const relativeTimeInPastMs = parseInt(hoursInput) * 60 * 60 * 1000;
  return new Date(currentTimeMs - relativeTimeInPastMs).toISOString();
}
