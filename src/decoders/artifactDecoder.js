import { Artifacts } from '../modules/records'

let supported_artifact_types = {}

for (let artifact in Artifacts) {
  let type = Artifacts[artifact].getArtifactType() + '-' + Artifacts[artifact].getArtifactSubtype()
  supported_artifact_types[type.toLowerCase()] = Artifacts[artifact]
}

const BaseArtifact = supported_artifact_types['artifact-']

/**
 * Parses json to return an Artifact class
 * @param {object} json - json artifact
 * @return {Artifact}
 * @example
 * let txid = "32dd84b5d756801b8050c7e2757c06cf73f1e5544e7c25afb0ef87e6ddbfba57"
 * let res = (await api.get(`snowflake.oip.fun:1606/artifact/get/${txid}`)).data
 * let [json] = res.results
 * let artifact = decodeArtifact(json)
 * artifact instanceof Artifact //true
 */
function decodeArtifact (json) {
  if (!json.artifact || !json.meta) {
    return new BaseArtifact(json)
  }

  if (json.meta.type === 'alexandria-media') {
    let artifactType = json.artifact.type.toLowerCase()
    return decode(artifactType, json)
  } else if (json.meta.type === 'oip041') {
    let artifactType = json.artifact.type.toLowerCase()
    return decode(artifactType, json)
  } else if (json.meta.type === 'oip042') {
    let type = json.artifact.type
    let subtype = json.artifact.subtype || ''
    let artifactType = (type + '-' + subtype).toLowerCase()
    return decode(artifactType, json)
  } else {
    return new BaseArtifact['artifact-'](json)
  }
}

function decode (a_type, json) {
  for (let type in supported_artifact_types) {
    if (supported_artifact_types.hasOwnProperty(type) && type === a_type) {
      return new supported_artifact_types[type](json)
    }
  }

  return new BaseArtifact(json)
}

export default decodeArtifact
