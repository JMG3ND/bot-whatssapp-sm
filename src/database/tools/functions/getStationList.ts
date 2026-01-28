import { montainConnection } from "../../montainConnection"

export async function getStationList() {
  const stations = await montainConnection.$queryRaw`
    SELECT StationName FROM dStation
    where StationName IS NOT NULL;
  ` as { StationName: string }[]

  const listArray = stations.map(station => station.StationName)
  return listArray
}
