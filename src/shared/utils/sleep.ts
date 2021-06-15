// This is a useful function to demo/debug things that are time based. Like showing
// a loading indicator while waiting for a network request. We can artificially
// increase the time that the request will take by sleeping for a bit.
const sleep = (ms: number): Promise<any> =>
  new Promise((res) => {
    setTimeout(res, ms);
  });
export default sleep;
