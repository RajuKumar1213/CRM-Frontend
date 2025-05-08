function extractErrorMessage(htmlString) {
  // Parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Get the content of the <pre> tag
  const preContent = doc.querySelector("pre")?.textContent;

  // Extract and return only the first sentence of the error
  if (preContent) {
    const firstLine = preContent.split("\n")[0].trim(); // Get the first line
    const firstSentence = firstLine.split("at file")[0].trim(); // Handle multiple spaces or newlines Handle multiple spaces or newlines
    return firstSentence;
  }
  return null;
}

export default extractErrorMessage;
