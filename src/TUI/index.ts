import banner from "./assets/banner";
import inputCalling from "./inputCalling";
import screenManaging from "./screenManaging";
import * as separator from "./separator";
import * as textProcessing from "./textProcessing";
import Tutorial from "./Tutorial";

export default {
    banner,
    ...inputCalling,
    ...screenManaging,
    ...separator,
    ...Tutorial,
    ...textProcessing,
};
