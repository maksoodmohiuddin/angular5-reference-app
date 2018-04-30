export interface Search {
  resourceType: string,
  id: string,
  meta: {
    versionId: string,
    lastUpdated: string
  },
  text: {
    status: string,
    div: string
  },
  name: [
    {
      family: string,
      given: [
        string
        ]
    }]
}
