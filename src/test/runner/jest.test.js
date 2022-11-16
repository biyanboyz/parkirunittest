let moment = require("moment");

(()=>{
  let setting = { mobil: { per_jam: 5000, per_hari: 80000 }, motor: { per_jam: 2000, per_hari: 40000 } };
  let sut = require("../../app/proses/implmnts/double").default;
  test("mobil parkir 1 jam 1 menit 2 detik berarti bayarnya 10000", ()=>(
    sut(
      setting,
      "Mobil",
      moment("00:00:00", "hh:mm:ss").toDate(),
      moment("01:01:02", "hh:mm:ss").toDate(),
    )
    .then(sut=>expect(sut).toStrictEqual(10000))
  ));
  test("mobil 1 hari 6 jam = (1 x 80000) + (6 x 5000) = 110.000", ()=>(
    sut(
      setting,
      "Mobil",
      moment("00:00:00", "hh:mm:ss").toDate(),
      moment("00:00:00", "hh:mm:ss")
        .add(moment.duration((1*24)+6, 'hours'))
        .toDate()
    )
    .then(sut=>expect(sut).toStrictEqual(110000))
  ));
})();

(()=>{
  let sut = require("../../app/pencarian/implmnts/double").default;
  (()=>{
    let input = [
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00"),
          keluar: new Date("2022-01-01T01:01:02"),
        },
        harga: 10000
      },
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00"),
          keluar: new Date("2022-01-01T01:01:02"),
        },
        harga: 10000
      },
      { 
        tipe: /** @type {"Motor"} */("Motor"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00"),
          keluar: new Date("2022-01-01T01:01:02"),
        },
        harga: 10000
      }
    ];
    test("Tipe: mobil", ()=>{
      let output = [
        { 
          tipe: "Mobil",
          waktu: {
            masuk: new Date("2022-01-01T00:00:00"),
            keluar: new Date("2022-01-01T01:01:02"),
          },
          harga: 10000
        },
        { 
          tipe: "Mobil",
          waktu: {
            masuk: new Date("2022-01-01T00:00:00"),
            keluar: new Date("2022-01-01T01:01:02"),
          },
          harga: 10000
        },
      ];
      return (
        sut(
          input,
          {
            tipe: { mobil: true, motor: false },
            waktu: null,
            harga: null
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
    test("Tipe: motor", ()=>{
      let output = [
        { 
          tipe: /** @type {"Motor"} */("Motor"),
          waktu: {
            masuk: new Date("2022-01-01T00:00:00"),
            keluar: new Date("2022-01-01T01:01:02"),
          },
          harga: 10000
        }
      ];
      return (
        sut(
          input,
          {
            tipe: { mobil: false, motor: true },
            waktu: null,
            harga: null
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
  })();
  (()=>{
    let input = [
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00Z"),
          keluar: new Date("2022-01-01T05:00:00Z"),
        },
        harga: 10000
      },
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T02:00:00Z"),
          keluar: new Date("2022-01-01T03:00:00Z"),
        },
        harga: 10000
      },
      { 
        tipe: /** @type {"Motor"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T06:00:00Z"),
          keluar: new Date("2022-01-01T07:00:00Z"),
        },
        harga: 10000
      }
    ];
    test("Waktu: dari jam 0 sampai jam 5", ()=>{
      let output = [
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T00:00:00Z"),
            keluar: new Date("2022-01-01T05:00:00Z"),
          },
          harga: 10000
        },
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T02:00:00Z"),
            keluar: new Date("2022-01-01T03:00:00Z"),
          },
          harga: 10000
        },
      ];
      return (
        sut(
          input,
          {
            tipe: null,
            waktu: {
              dari: new Date("2022-01-01T00:00:00Z"),
              sampai: new Date("2022-01-01T05:00:00Z"),
            },
            harga: null
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
    test("Waktu: dari jam 1 sampai jam 4", ()=>{
      let output = [
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T02:00:00Z"),
            keluar: new Date("2022-01-01T03:00:00Z"),
          },
          harga: 10000
        },
      ];
      return (
        sut(
          input,
          {
            tipe: null,
            waktu: {
              dari: new Date("2022-01-01T01:00:00Z"),
              sampai: new Date("2022-01-01T04:00:00Z"),
            },
            harga: null
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });

    test("Waktu: dari jam 6 sampai jam 7", ()=>{
      let output = [
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T06:00:00Z"),
            keluar: new Date("2022-01-01T07:00:00Z"),
          },
          harga: 10000
        }
      ];
      return (
        sut(
          input,
          {
            tipe: null,
            waktu: {
              dari: new Date("2022-01-01T06:00:00Z"),
              sampai: new Date("2022-01-01T07:00:00Z"),
            },
            harga: null
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
  })();
  (()=>{
    let input = [
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00Z"),
          keluar: new Date("2022-01-01T05:00:00Z"),
        },
        harga: 10000
      },
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00Z"),
          keluar: new Date("2022-01-01T05:00:00Z"),
        },
        harga: 100000
      },
      { 
        tipe: /** @type {"Mobil"} */("Mobil"),
        waktu: {
          masuk: new Date("2022-01-01T00:00:00Z"),
          keluar: new Date("2022-01-01T05:00:00Z"),
        },
        harga: 200000
      },
    ];
    test("Harga: dari 100rb sampai jam 200rb", ()=>{
      let output = [
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T00:00:00Z"),
            keluar: new Date("2022-01-01T05:00:00Z"),
          },
          harga: 100000
        },
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T00:00:00Z"),
            keluar: new Date("2022-01-01T05:00:00Z"),
          },
          harga: 200000
        },
      ];
      return (
        sut(
          input,
          {
            tipe: null,
            waktu: null,
            harga: { dari: 100000, sampai: 200000 }
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
    test("Harga: 10rb", ()=>{
      let output = [
        { 
          tipe: /** @type {"Mobil"} */("Mobil"),
          waktu: {
            masuk: new Date("2022-01-01T00:00:00Z"),
            keluar: new Date("2022-01-01T05:00:00Z"),
          },
          harga: 10000
        },
      ];
      return (
        sut(
          input,
          {
            tipe: null,
            waktu: null,
            harga: { dari: 10000, sampai: null }
          }
        )
        .then(sut=>{
          let x = sut;
          return x;
        })
        .then(sut=>expect(sut).toStrictEqual(output))
      )
    });
  })();
})();