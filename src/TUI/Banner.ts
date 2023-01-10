import fs from "fs";
import path from "path";

const bannerPath = "./banner.txt";

const banner = fs.readFileSync(
    path.join(__dirname, bannerPath),
    { encoding: "utf-8", flag: "r" }
);

export default { banner };