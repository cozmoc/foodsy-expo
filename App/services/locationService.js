module.exports = {
  getCities: (text) => fetch('http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=US,CA&q=' + decodeURIComponent(text))
    .then(res => res.text())
    .then(res => {
      try {
        const suggestions = res.match(/\?\((.*)\);/)[1];
        if (suggestions == `["%s"]`) {
          return [];
        }
        return Promise.resolve(JSON.parse(suggestions));
      } catch(e) {}
    }),
  getAddress: (lat, lon) => fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`)
    .then(res => res.json()),
}
