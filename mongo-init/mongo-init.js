// mongo-init/init.js

// Switch to database
db = db.getSiblingDB("1Stop");

// Create collections if they don't exist
db.Stops.drop();
db.Routes.drop();

// Create collections
db.createCollection("Stops");
db.createCollection("Routes");

const stops = [
  {
    "stopId": "S1",
    "name": "Kempegowda Bus Station",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5732,
        12.9767
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 0
      }
    ]
  },
  {
    "stopId": "S2",
    "name": "Corporation",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5880,
        12.9699
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 3
      },
      {
        "routeNumber": "15G",
        "index": 16
      }
    ]
  },
  {
    "stopId": "S3",
    "name": "Town Hall",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5828,
        12.9669
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 4
      },
      {
        "routeNumber": "15G",
        "index": 15
      }
    ]
  },
  {
    "stopId": "S4",
    "name": "Krishnarajendra Market",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5768,
        12.9620
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 5
      },
      {
        "routeNumber": "15G",
        "index": 14
      }
    ]
  },
  {
    "stopId": "S5",
    "name": "Makkala Koota",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5701,
        12.9554
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 6
      },
      {
        "routeNumber": "15G",
        "index": 13
      }
    ]
  },
  {
    "stopId": "S6",
    "name": "Mahila Samaja",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5714,
        12.9469
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 7
      },
      {
        "routeNumber": "15G",
        "index": 12
      }
    ]
  },
  {
    "stopId": "S7",
    "name": "National College",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5715,
        12.9427
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 8
      },
      {
        "routeNumber": "15G",
        "index": 11
      }
    ]
  },
  {
    "stopId": "S8",
    "name": "Basavanagudi Police Station",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5721,
        12.9405
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 9
      },
      {
        "routeNumber": "15G",
        "index": 10
      }
    ]
  },
  {
    "stopId": "S9",
    "name": "Tata Silk Farm",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5750,
        12.9348
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 10
      },
      {
        "routeNumber": "15G",
        "index": 9
      }
    ]
  },
  {
    "stopId": "S10",
    "name": "M M Industries",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5689,
        12.9298
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 11
      },
      {
        "routeNumber": "15G",
        "index": 8
      }
    ]
  },
  {
    "stopId": "S11",
    "name": "Shasthri Bekary",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5670,
        12.9255
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 12
      },
      {
        "routeNumber": "15G",
        "index": 7
      }
    ]
  },
  {
    "stopId": "S12",
    "name": "Monotype",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5630,
        12.9234
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 13
      },
      {
        "routeNumber": "15G",
        "index": 6
      }
    ]
  },
  {
    "stopId": "S13",
    "name": "Cauvery Nagara",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5589,
        12.9201
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 14
      },
      {
        "routeNumber": "15G",
        "index": 5
      }
    ]
  },
  {
    "stopId": "S14",
    "name": "Yarab Nagara",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5562,
        12.9157
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 15
      },
      {
        "routeNumber": "15G",
        "index": 4
      }
    ]
  },
  {
    "stopId": "S15",
    "name": "Kadirenahalli Cross",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5566,
        12.9101
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 16
      },
      {
        "routeNumber": "15G",
        "index": 3
      }
    ]
  },
  {
    "stopId": "S16",
    "name": "Dayananda Sagar College",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5645,
        12.9084
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 17
      },
      {
        "routeNumber": "15G",
        "index": 2
      }
    ]
  },
  {
    "stopId": "S17",
    "name": "Maharani College",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5813,
        12.9719
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 1
      }
    ]
  },
  {
    "stopId": "S18",
    "name": "KR Circle",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5847,
        12.9716
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 2
      }
    ]
  },
  {
    "stopId": "S19",
    "name": "Kumaraswamy Layout Police Station",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5681,
        12.9069
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 18
      }
    ]
  },
  {
    "stopId": "S20",
    "name": "Kumaraswamy Layout",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5722,
        12.9055
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 19
      }
    ]
  },
  {
    "stopId": "S21",
    "name": "Canara Bank",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5739,
        12.9009
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 20
      }
    ]
  },
  {
    "stopId": "S22",
    "name": "ISRO Layout",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5750,
        12.8995
      ]
    },
    "routes": [
      {
        "routeNumber": "210A",
        "index": 21
      }
    ]
  },
  {
    "stopId": "S23",
    "name": "Kumaraswamy Layout 2nd Stage",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5699,
        12.9125
      ]
    },
    "routes": [
      {
        "routeNumber": "15G",
        "index": 0
      }
    ]
  },
  {
    "stopId": "S24",
    "name": "Water Tank Kumaraswamy Layout",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5668,
        12.9113
      ]
    },
    "routes": [
      {
        "routeNumber": "15G",
        "index": 1
      }
    ]
  },
  {
    "stopId": "S25",
    "name": "Cauvery Bhavana",
    "location": {
      "type": "Point",
      "coordinates": [
        77.5802,
        12.9739
      ]
    },
    "routes": [
      {
        "routeNumber": "15G",
        "index": 17
      }
    ]
  }
]
const routes = [
    {
        "routeNumber": "210A",
        "routeType" : "C",
        "stops": [
            {
                "index": 0,
                "stopId": "S1",
                "name": "Kempegowda Bus Station",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5732,
                        12.9767
                    ]
                }
            },
            {
                "index": 1,
                "stopId": "S17",
                "name": "Maharani College",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5813,
                        12.9719
                    ]
                }
            },
            {
                "index": 2,
                "stopId": "S18",
                "name": "KR Circle",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5847,
                        12.9716
                    ]
                }
            },
            {
                "index": 3,
                "stopId": "S2",
                "name": "Corporation",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5880,
                        12.9699
                    ]
                }
            },
            {
                "index": 4,
                "stopId": "S3",
                "name": "Town Hall",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5828,
                        12.9669
                    ]
                }
            },
            {
                "index": 5,
                "stopId": "S4",
                "name": "Krishnarajendra Market",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5768,
                        12.9620
                    ]
                }
            },
            {
                "index": 6,
                "stopId": "S5",
                "name": "Makkala Koota",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5701,
                        12.9554
                    ]
                }
            },
            {
                "index": 7,
                "stopId": "S6",
                "name": "Mahila Samaja",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5714,
                        12.9469
                    ]
                }
            },
            {
                "index": 8,
                "stopId": "S7",
                "name": "National College",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5715,
                        12.9427
                    ]
                }
            },
            {
                "index": 9,
                "stopId": "S8",
                "name": "Basavanagudi Police Station",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5721,
                        12.9405
                    ]
                }
            },
            {
                "index": 10,
                "stopId": "S9",
                "name": "Tata Silk Farm",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5750,
                        12.9348
                    ]
                }
            },
            {
                "index": 11,
                "stopId": "S10",
                "name": "M M Industries",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5689,
                        12.9298
                    ]
                }
            },
            {
                "index": 12,
                "stopId": "S11",
                "name": "Shasthri Bekary",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5670,
                        12.9255
                    ]
                }
            },
            {
                "index": 13,
                "stopId": "S12",
                "name": "Monotype",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5630,
                        12.9234
                    ]
                }
            },
            {
                "index": 14,
                "stopId": "S13",
                "name": "Cauvery Nagara",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5589,
                        12.9201
                    ]
                }
            },
            {
                "index": 15,
                "stopId": "S14",
                "name": "Yarab Nagara",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5562,
                        12.9157
                    ]
                }
            },
            {
                "index": 16,
                "stopId": "S15",
                "name": "Kadirenahalli Cross",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5566,
                        12.9101
                    ]
                }
            },
            {
                "index": 17,
                "stopId": "S16",
                "name": "Dayananda Sagar College",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5645,
                        12.9084
                    ]
                }
            },
            {
                "index": 18,
                "stopId": "S19",
                "name": "Kumaraswamy Layout Police Station",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5681,
                        12.9069
                    ]
                }
            },
            {
                "index": 19,
                "stopId": "S20",
                "name": "Kumaraswamy Layout",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5722,
                        12.9055
                    ]
                }
            },
            {
                "index": 20,
                "stopId": "S21",
                "name": "Canara Bank",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5739,
                        12.9009
                    ]
                }
            },
            {
                "index": 21,
                "stopId": "S22",
                "name": "ISRO Layout",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5750,
                        12.8995
                    ]
                }
            }
        ]
    },
    {
        "routeNumber": "15G",
        "routeType" : "UD",
        "stops": [
            {
                "index": 0,
                "stopId": "S23",
                "name": "Kumaraswamy Layout 2nd Stage",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5699,
                        12.9125
                    ]
                }
            },
            {
                "index": 1,
                "stopId": "S24",
                "name": "Water Tank Kumaraswamy Layout",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5668,
                        12.9113
                    ]
                }
            },
            {
                "index": 2,
                "stopId": "S16",
                "name": "Dayananda Sagar College",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5645,
                        12.9084
                    ]
                }
            },
            {
                "index": 3,
                "stopId": "S15",
                "name": "Kadirenahalli Cross",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5566,
                        12.9101
                    ]
                }
            },
            {
                "index": 4,
                "stopId": "S14",
                "name": "Yarab Nagara",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5562,
                        12.9157
                    ]
                }
            },
            {
                "index": 5,
                "stopId": "S13",
                "name": "Cauvery Nagara",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5589,
                        12.9201
                    ]
                }
            },
            {
                "index": 6,
                "stopId": "S12",
                "name": "Monotype",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5630,
                        12.9234
                    ]
                }
            },
            {
                "index": 7,
                "stopId": "S11",
                "name": "Shasthri Bekary",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5670,
                        12.9255
                    ]
                }
            },
            {
                "index": 8,
                "stopId": "S10",
                "name": "M M Industries",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5689,
                        12.9298
                    ]
                }
            },
            {
                "index": 9,
                "stopId": "S9",
                "name": "Tata Silk Farm",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5750,
                        12.9348
                    ]
                }
            },
            {
                "index": 10,
                "stopId": "S8",
                "name": "Basavanagudi Police Station",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5721,
                        12.9405
                    ]
                }
            },
            {
                "index": 11,
                "stopId": "S7",
                "name": "National College",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5715,
                        12.9427
                    ]
                }
            },
            {
                "index": 12,
                "stopId": "S6",
                "name": "Mahila Samaja",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5714,
                        12.9469
                    ]
                }
            },
            {
                "index": 13,
                "stopId": "S5",
                "name": "Makkala Koota",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5701,
                        12.9554
                    ]
                }
            },
            {
                "index": 14,
                "stopId": "S4",
                "name": "Krishnarajendra Market",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5768,
                        12.9620
                    ]
                }
            },
            {
                "index": 15,
                "stopId": "S3",
                "name": "Town Hall",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5828,
                        12.9669
                    ]
                }
            },
            {
                "index": 16,
                "stopId": "S2",
                "name": "Corporation",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5880,
                        12.9699
                    ]
                }
            },
            {
                "index": 17,
                "stopId": "S25",
                "name": "Cauvery Bhavana",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.5802,
                        12.9739
                    ]
                }
            }
        ]
    }
]


const populateDB = async()=>{
  await db.Stops.insertMany(stops);
  await db.Routes.insertMany(routes);
  await db.Stops.createIndex({ location: "2dsphere" });
  await db.Routes.createIndex({ "stops.location": "2dsphere" });
}

populateDB().then(()=>{

  print("\n\n\n\nLoad successfull\n\n\n\n\n\n\n")
});
