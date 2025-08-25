import manifest from "../../_data/manifest_en.json" with {type: "json"};
import {makeDocsData} from "../../_lib/docsDataFactory.js";

export default makeDocsData(manifest, "en");
