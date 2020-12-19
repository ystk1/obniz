//-----------------------------
// ifttt setting
// -----------------------------
let ifttt_event = "temp";
let ifttt_secret_key = "tTISQkFXMRGvxD_f9zU3M";
//-----------------------------
// obniz setting
// -----------------------------
let obniz = new Obniz("1974-2903");
obniz.onconnect = async () => {
  //センシング
  // var sensor = obniz.wired("SHT31", { scl: 0, sda: 1 });

  while (true) {
    // var data = await sensor.getAllWait();
    // console.log("humidity:" + data.temperature);
    // console.log("temperature:" + data.humidity);
    //送信データ作成
    // var formData = new FormData();
    // formData.append("value1", data.temperature);
    // formData.append("value2", data.humidity);

    var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {
      signal: 0,
      vcc: 1,
      gnd: 2
    });
    var temp = await tempsens.getWait();
    console.log(temp);

    var formData = new FormData();
    formData.append("value1", temp);
    // formData.append("value2", data.humidity);

    //IFTTTリクエスト
    await fetch(
      `https://maker.ifttt.com/trigger/${ifttt_event}/with/key/${ifttt_secret_key}`,
      {
        method: "POST",
        mode: "no-cors",
        body: formData
      }
    )
      .then(() => console.log("success"))
      .catch((error) => console.log(error));
    //1分ごとに起動するように
    for (let i = 0; i < 1000; i++) {
      await obniz.wait(60 * 1);
    }
  }
};
