const player = [
  {
    nickname: "태민",
    master: true,
    socre: 0
  },
  {
    nickname: "태민b",
    master: false,
    socre: 3
  },
  {
    nickname: "태민d",
    master: false,
    socre: 2
  }
];
const playerscore = [];
player.forEach(data => {
  playerscore.push([data.socre, data.nickname]);
});
console.log(playerscore.sort());
