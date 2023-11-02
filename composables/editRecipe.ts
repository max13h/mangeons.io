export const useParseStringToStepListObject = (listString: string) => {
  // Split the string into lines and remove the empty line
  const lines = listString.split("\n")

  const finalArrayOfObjects: any[] = []
  let previousLineNumber = 0

  for (let line of lines) {
    const nestingLevel = line.search(/\S/)

    line = line.trim()
    const lineNumber = parseInt(line[0])

    if (nestingLevel > 0) {
      console.log(finalArrayOfObjects[previousLineNumber - 1])
      const nestedObject = {
        id: finalArrayOfObjects[previousLineNumber - 1].nested.length,
        value: line.substring(3),
        index: finalArrayOfObjects[previousLineNumber - 1].nested.length
      }
      finalArrayOfObjects[previousLineNumber - 1].nested.push(nestedObject)
    } else {
      previousLineNumber = lineNumber

      const object = {
        id: finalArrayOfObjects.length,
        value: line.substring(3),
        index: finalArrayOfObjects.length,
        nested: []
      }
      finalArrayOfObjects.push(object)
    }
  }
  return finalArrayOfObjects
}
