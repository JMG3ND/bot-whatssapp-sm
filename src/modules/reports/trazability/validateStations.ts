import { getStationList } from '@database/tools/functions/getStationList'

export async function validateStations(station: string) {
  const stationList = await getStationList()
  const stationNames = stationList.map(s => s.toLowerCase())
  return stationNames.includes(station.toLowerCase())
}
