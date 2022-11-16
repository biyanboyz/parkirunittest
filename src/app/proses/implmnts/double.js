let moment = require("moment");

/** @type {(setting: {mobil: {per_jam: number, per_hari: number}, motor: {per_jam: number, per_hari: number}}, tipe: "Mobil"|"Motor", masuk: Date, keluar: Date)=>Promise<number>} */ exports.default = (setting, tipe, masuk, keluar)=>(
  Promise.resolve(
    [null]
    .map(_=>({ masuk: moment(masuk), keluar: moment(keluar) }))
    .map(waktu=>moment.duration(waktu.keluar.diff(waktu.masuk)))
    .map(durasi=>({
      hari: durasi.days(),
      jam: durasi.hours(),
      menit: durasi.minutes(),
    }))
    .map(durasi=>(
      (
        durasi.hari
        *
        (()=>{
          switch(tipe){
            case "Mobil": return setting.mobil.per_hari;
            case "Motor": return setting.motor.per_hari;
          }(/** @param {never} x */(x)=>{throw new Error;})(tipe)
        })()
      )
      +
      (
        (
          durasi.jam
          +
          (durasi.menit >= 1 ? 1 : 0)
        )
        *
        (()=>{
          switch(tipe){
            case "Mobil": return setting.mobil.per_jam;
            case "Motor": return setting.motor.per_jam;
          }(/** @param {never} x */(x)=>{throw new Error;})(tipe)
        })()
      )
    ))
    .reduce((p, v)=>v)
  )
);