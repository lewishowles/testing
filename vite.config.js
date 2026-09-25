import { defineConfig } from "vite-plus";
import lintConfigBase from "@lewishowles/lint-config/base.json" with { type: "json" };
import fmt from "./.oxfmtrc.json" with { type: "json" };
import oxlintrc from "./.oxlintrc.json" with { type: "json" };

// The lint settings for vp check and vp lint, which read only this block and
// ignore .oxlintrc.json. The shared base rules load here, and the repo's own
// environments, ignored paths and overrides are copied in from .oxlintrc.json.
const lint = {
	...lintConfigBase,
	env: oxlintrc.env,
	ignorePatterns: oxlintrc.ignorePatterns,
	overrides: [...(lintConfigBase.overrides ?? []), ...(oxlintrc.overrides ?? [])],
};

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt,
	lint,
});
