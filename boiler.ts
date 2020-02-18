import { join } from "path"
import { InstallBoiler } from "boiler-dev"

export const installBoiler: InstallBoiler = async ({
  destDir,
  files,
}) => {
  const actions = []

  for (const { name, source } of files) {
    if (name === "release") {
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

  return actions
}
