const serializer = ({res}: {
  res: GoogleAppsScript.URL_Fetch.HTTPResponse
}): {
  status: number,
  body: any,
} => {
  const status = res.getResponseCode();
  const body = JSON.parse(res.getContentText('utf-8'));
  return { status, body };
};

export default serializer;