import { join } from "path"
import { InstallBoiler, PromptBoiler } from "boiler-dev"

export const promptBoiler: PromptBoiler = async () => {
  return [
    {
      type: "confirm",
      name: "private",
      message: "private project?",
      default: false,
    },
  ]
}

export const installBoiler: InstallBoiler = async ({
  answers,
  destDir,
  files,
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
        path: join(destDir, "bin/release"),
        source,
      })
    }
  }

  actions.push({
    action: "npmInstall",
    dev: true,
    source: ["release-it", "semver"],
  })

  if (answers.private) {
    actions.push({
      action: "merge",
      path: join(destDir, "package.json"),
      source: { private: true },
    })
  }

  return actions
}
