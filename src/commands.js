import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = path.resolve(__dirname, "./commands");

fs.readdir(commandsDir, (err, files) => {
	if (err) {
		console.error("Error reading commands directory:", err);

		return;
	}

	files.forEach(async (file) => {
		if (file.endsWith(".js")) {
			await import(`./commands/${file}`);
		}
	});
});
