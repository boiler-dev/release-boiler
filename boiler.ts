import { ActionBoiler, PromptBoiler } from "boiler-dev"

export const prompt: PromptBoiler = async () => {
  return [
    {
      type: "confirm",
      name: "private",
      message: "private project?",
      default: false,
    },
  ]
}

export const install: ActionBoiler = async () => {
  const actions = []

  actions.push({
    action: "npmInstall",
    dev: true,
    source: ["release-it", "semver"],
  })

  return actions
}

export const generate: ActionBoiler = async ({
  answers,
}) => {
  const actions = []

  actions.push({
    action: "write",
    bin: true,
    path: "bin/release",
    sourcePath: "release",
    modify: (src: string) => {
      if (answers.private) {
        src = src.replace(/--ci/gm, "--ci --no-npm.publish")
      }
      return src
    },
  })

  actions.push({
    action: "merge",
    path: "package.json",
    source: { private: answers.private },
  })

  return actions
}
