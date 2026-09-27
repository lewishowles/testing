import { defineConfig } from "vite-plus";
import lintConfigBase from "@lewishowles/lint-config/base.json" with { type: "json" };
import lintConfigComments from "@lewishowles/lint-config/comments.json" with { type: "json" };
import fmt from "./.oxfmtrc.json" with { type: "json" };
import oxlintrc from "./.oxlintrc.json" with { type: "json" };

// The lint settings for vp check and vp lint, which read only this block and
// ignore .oxlintrc.json. The shared base and comment rules load here, and the
// repo's own environments, ignored paths and overrides are copied in from
// .oxlintrc.json.
const lint = {
	...lintConfigBase,
	env: oxlintrc.env,
	ignorePatterns: oxlintrc.ignorePatterns,
	jsPlugins: [...lintConfigBase.jsPlugins, ...lintConfigComments.jsPlugins],
	overrides: [
		...(lintConfigBase.overrides ?? []),
		...(lintConfigComments.overrides ?? []),
		...(oxlintrc.overrides ?? []),
	],
	rules: { ...lintConfigBase.rules, ...lintConfigComments.rules },
};

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt,
	lint,
});
