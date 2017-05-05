import axios from 'axios'
import cheerio from 'cheerio'
import mapFunction from '../../utlis/maps'
import P from 'bluebird'
import Rx from 'rxjs/Rx'
import mongoose from 'mongoose'

import Location from '../../model/locationSchema'

const urlForHillStations = 'https://en.wikipedia.org/wiki/List_of_hill_stations_in_India'
const urlForBeach = 'https://en.wikipedia.org/wiki/List_of_beaches_in_India'

const stateNames = [
  {
    stateId: 'Goa',
    stateName: 'Goa',
    relativeLocation: 'WEST'
  },
  {
    stateId: 'Andhra_Pradesh',
    stateName: 'Andhra Pradesh',
    relativeLocation: 'SOUTH'
  },
  {
    stateId: 'Arunachal_Pradesh',
    stateName: 'Arunachal Pradesh',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Assam',
    stateName: 'Assam',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Chhattisgarh',
    stateName: 'Chhattisgarh',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Gujarat',
    stateName: 'Gujarat',
    relativeLocation: 'WEST'
  },
  {
    stateId: 'Haryana',
    stateName: 'Haryana',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'Himachal_Pradesh',
    stateName: 'Himachal Pradesh',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'Jammu_and_Kashmir',
    stateName: 'Jammu and Kashmir',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'Jharkhand',
    stateName: 'Jharkhand',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Karnataka',
    stateName: 'Karnataka',
    relativeLocation: 'SOUTH'
  },
  {
    stateId: 'Kerala',
    stateName: 'Kerala',
    relativeLocation: 'SOUTH'
  },
  {
    stateId: 'Madhya_Pradesh',
    stateName: 'Madhya Pradesh',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'Maharashtra',
    stateName: 'Maharashtra',
    relativeLocation: 'WEST'
  },
  {
    stateId: 'Manipur',
    stateName: 'Manipur',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Meghalaya',
    stateName: 'Meghalaya',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Mizoram',
    stateName: 'Mizoram',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Nagaland',
    stateName: 'Nagaland',
    relativeLocation: 'EAST'
  },
  {
    stateId:'Odisha',
    stateName:'Odisha',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Punjab',
    stateName: 'Punjab',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'Rajasthan',
    stateName: 'Rajasthan',
    relativeLocation: 'WEST'
  },
  {
    stateId: 'Sikkim',
    stateName: 'Sikkim',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Tamil_Nadu',
    stateName: 'Tamil Nadu',
    relativeLocation: 'SOUTH'
  },
  {
    stateId: 'Telangana',
    stateName: 'Telangana',
    relativeLocation: 'SOUTH'
  },
  {
    stateId: 'Tripura',
    stateName: 'Tripura',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Uttarakhand',
    stateName: 'Uttarakhand',
    relativeLocation: 'NORTH'
  },
  {
    stateId: 'West_Bengal',
    stateName: 'West Bengal',
    relativeLocation: 'EAST'
  },
  {
    stateId: 'Pondicherry',
    stateName: 'Pondicherry',
    relativeLocation: 'EAST'
  }
]

function selectNextUl(node) {
  if(node[0].name === 'ul') {
    return node
  }
  else{
    return selectNextUl(node.next())
  }
}

export default function extractDataFromWikipedia() {
  let hillStations = []
  let beaches = []
  axios
    .get(urlForHillStations, {
      timeout: 30000
    })
    .then(function(response) {
      const $ = cheerio.load(response.data)

      stateNames.map((s) => {
        if($("#"+s.stateId).text()) {
          const headNode = $("#" + s.stateId).parent()
          const listNode = selectNextUl(headNode.next())
          listNode.children().map((index, elem) => {
            const text = $(elem).text()
            if(text.indexOf(':') > 1) {
              const index = text.indexOf(':') + 1
              const names = text.substring(index).split('\n')
              names.map((name) => {
                if (name.length > 1) {
                  hillStations.push({
                    name: name,
                    state: s.stateName
                  })
                }
                return name
              })
            }
            else {
              const name = text.indexOf(',') > -1 ? text.split(',')[0] : text
              // console.log(name)
              hillStations.push({
                name: name,
                state: s.stateName
              })
            }
            return elem
          })
        }
      })
      // console.log(hillStations)
      hillStations.map((hill) => {
        const newLocation = new Location({
          name: hill.name,
          state: hill.state,
          country: 'India',
          category: 'HILL_STATION'
        })
        newLocation
          .save()
          .then((doc) => {
            // console.log(doc)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })
    .catch((err) => {
      console.log(err)
    })

  axios
    .get(urlForBeach)
    .then(function(response) {
      const $ = cheerio.load(response.data)
      stateNames.map((s) => {
        if($("#"+s.stateId).text()) {
          const headNode = $("#"+s.stateId).parent()
          const listNode = selectNextUl(headNode.next())
          listNode.children().map((index, elem) => {
            const text = $(elem).text()
            if(text.indexOf(':') > 1) {
              const index = text.indexOf(':') + 1
              const names = text.substring(index).split('\n')
              names.map((name) => {
                if (name.length > 1) {
                  beaches.push({
                    name: name,
                    state: s.stateName
                  })
                }
                return name
              })
            }
            else {
              const name = text.indexOf(',') > -1 ? text.split(',')[0] : text
              // console.log(name)
              beaches.push({
                name: name,
                state: s.stateName
              })
            }
            return elem
          })
        }
      })
      // console.log(beaches)
      beaches.map((beach) => {
        const newLocation = new Location({
          name: beach.name,
          state: beach.state,
          country: 'India',
          category: 'BEACH'
        })
        newLocation
          .save()
          .then((doc) => {
            console.log(doc)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })
    .catch((err) => {
      console.log("ERRRRR")
      console.log(err)
    })
}