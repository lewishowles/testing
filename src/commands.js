import fs from "fs";
import path from "path";

const commandsDir = path.resolve(__dirname, "./commands");

fs.readdir(commandsDir, (err, files) => {
	if (err) {
		console.error("Error reading commands directory:", err);

		return;
	}

	files.forEach((file) => {
		if (file.endsWith(".js")) {
			require(`./commands/${file}`);
		}
	});
});
