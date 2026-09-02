import fs from 'node:fs'
import { parseArgs } from 'node:util'

import * as core from '@actions/core'
import axios, {isAxiosError} from 'axios'

import { type ExecResult, type IBuildAgent } from '@agents/common'
import { type IRunner } from '@tools/common'

async function validateSubscription() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let repoPrivate: boolean | undefined

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    repoPrivate = eventData?.repository?.private
  }

  const upstream = 'GitTools/actions';
  const action = process.env.GITHUB_ACTION_REPOSITORY;
  const docsUrl = 'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions';

  core.info('');
  core.info('\u001b[1;36mStepSecurity Maintained Action\u001b[0m');
  core.info(`Secure drop-in replacement for ${upstream}`);
  if (repoPrivate === false) core.info('\u001b[32m\u2713 Free for public repositories\u001b[0m');
  core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`);
  core.info('');

  if (repoPrivate === false) return;

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const body: Record<string, string> = { action: action || '' };
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl;
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body, { timeout: 3000 }
    );
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(`\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m`);
      core.error(`\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`);
      process.exit(1);
    }
    core.info('Timeout or API not reachable. Continuing to next step.');
  }
}

type CliArgs = {
    agent: string
    tool: string
    command: string
}

export async function getAgent(buildAgent: string | undefined): Promise<IBuildAgent> {
    const agent = `./${buildAgent}/agent.mjs`
    const module = (await import(agent)) as { BuildAgent: new () => IBuildAgent }
    return new module.BuildAgent()
}

export async function getToolRunner(buildAgent: string | undefined, tool: string | undefined): Promise<IRunner> {
    const agent = await getAgent(buildAgent)
    const toolRunner = `./libs/${tool}.mjs`
    const module = (await import(toolRunner)) as { Runner: new (buildAgent: IBuildAgent) => IRunner }
    return new module.Runner(agent)
}

export function parseCliArgs(): CliArgs {
    return parseArgs({
        options: {
            agent: { type: 'string', short: 'a' },
            tool: { type: 'string', short: 't' },
            command: { type: 'string', short: 'c' }
        }
    }).values as CliArgs
}

export async function run(agent: string, tool: string, command: string): Promise<ExecResult> {
    await validateSubscription()
    const runner = await getToolRunner(agent, tool)
    return await runner.run(command)
}

/**
 * Returns all indexes of a specified single character within a given string.
 *
 * Iterates through the `searchString` and collects the zero-based indexes
 * where the character `indexOf` appears. Throws an error if `indexOf` is not a single character.
 *
 * @param searchString - The string to search within.
 * @param indexOf - The single character to find in the string.
 * @returns An array of indexes where the character appears in the string.
 * @throws {Error} If `indexOf` is not a single character.
 */
export function allIndexesOf(searchString: string, indexOf: string): number[] {
    if (indexOf.length !== 1) {
        throw new Error('indexOf must be a single character')
    }

    const resultArray: number[] = []

    for (let i = 0; i < searchString.length; i++) {
        if (searchString[i] === indexOf) {
            resultArray.push(i)
        }
    }

    return resultArray
}
