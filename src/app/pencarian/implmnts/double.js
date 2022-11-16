let moment = require("moment");

/** @typedef {{ tipe: "Mobil"|"Motor", waktu: { masuk: Date, keluar: Date }, harga: number }} Data */
/** @type {(state: Data[], criteria: { tipe: null|{mobil: boolean, motor: boolean}, waktu: null|{ dari: null|Date, sampai: null|Date }, harga: null|{ dari: null|number, sampai: null|number } })=>Promise<Data[]>} */ exports.default = (state, criteria)=>(
  Promise.resolve(
    state.filter(v=>(
      (
        criteria.tipe === null
        ||
        criteria.tipe !== null && (
          v.tipe == "Mobil" && criteria.tipe.mobil
          ||
          v.tipe == "Motor" && criteria.tipe.motor
        )
      )
      &&
      (
        criteria.waktu === null
        ||
        criteria.waktu !== null &&
        (
          !!criteria.waktu.dari && !!criteria.waktu.sampai
          ?
          (()=>{let x = (
            criteria.waktu.dari !== null && criteria.waktu.sampai !== null
            && moment(v.waktu.masuk).isBetween(criteria.waktu.dari, criteria.waktu.sampai, undefined, '[]')
          );
          return x;})()
          :
          [ criteria.waktu.dari !== null ? criteria.waktu.dari : criteria.waktu.sampai ]
          .map(dariSampai=>moment(v.waktu.masuk).isSameOrBefore(dariSampai))
          .reduce((p, v)=>v)
        )
      )
      &&
      (
        criteria.harga === null
        ||
        criteria.harga !== null &&
        (
          !!criteria.harga.dari && !!criteria.harga.sampai
          ?
          (()=>{let x = (
            criteria.harga.dari !== null && criteria.harga.sampai !== null
            && v.harga >= criteria.harga.dari && v.harga <= criteria.harga.sampai
          );
          return x;})()
          :
          [ criteria.harga.dari !== null ? criteria.harga.dari : criteria.harga.sampai ]
          .map(dariSampai=>!!dariSampai ? v.harga <= dariSampai : true)
          .reduce((p, v)=>v)
        )
      )
    ))
  )
);