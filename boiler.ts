import { join } from "path"
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
  files,
  cwdPath,
}) => {
  const actions = []

  for (const file of files) {
    const { name } = file

    if (name === "release") {
      let { source } = file

      if (answers.private) {
        source = source.replace(
          /--ci/gm,
          "--ci --no-npm.publish"
        )
      }

      actions.push({
        action: "write",
        bin: true,
        path: join(cwdPath, "bin/release"),
        source,
      })
    }
  }

  actions.push({
    action: "merge",
    path: join(cwdPath, "package.json"),
    source: { private: answers.private },
  })

  return actions
}
