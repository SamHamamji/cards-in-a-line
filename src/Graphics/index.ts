import fs from "fs";
import { bold } from "colors/safe";

const banner = bold(fs.readFileSync(
    "./src/Graphics/banner.txt",
    { encoding: "utf-8", flag: "r" }
));

export default { banner };