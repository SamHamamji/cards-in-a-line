import { readFileSync } from "fs";
import path from "path";

const bannerPath = "./banner.txt";

const banner = readFileSync(
    path.join(__dirname, bannerPath),
    { encoding: "utf-8", flag: "r" }
);

export default banner;
