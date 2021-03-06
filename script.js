let mapContainer = document.getElementById('map');
let pdfPrint = document.getElementById('pdfPrint');
// The map
    var map = new ol.Map({
        target: 'map',
        view: new ol.View ({
          zoom: 5,
          center: [266812, 5960201]
        }),
        controls: ol.control.defaults({ "attribution": false }),
        layers: [
          new ol.layer.Tile({ title:'Waterolor', source: new ol.source.Stamen({ layer: 'watercolor' }) }),
          new ol.layer.Tile({ title:'Labels', source: new ol.source.Stamen({ layer: 'toner-labels' }) })
        ]
      });

    map.addControl(new ol.control.LayerSwitcher());

    // GeoJSON vector layer
    var vector = new ol.layer.Vector({
      name: '1914-18',
      source: new ol.source.Vector({
        url: './fond_guerre.geojson',
        projection: 'EPSG:3857',
        format: new ol.format.GeoJSON(),
        attributions: [ '&copy; <a href="https://data.culture.gouv.fr/explore/dataset/fonds-de-la-guerre-14-18-extrait-de-la-base-memoire">data.culture.gouv.fr</a>' ]
      })
    });

    map.addLayer(vector);

    // Print control
    var printControl = new ol.control.Print();
    map.addControl(printControl);

    /* On print > save image file */
    printControl.on('printing', function(e) {
      mapContainer.style.opacity = 0.5;
    });
    printControl.on(['print', 'error'], function(e) {
    //   $('#map').css('opacity', 1);
      mapContainer.style.opacity = 1;
      // Print success
      if (e.image) {            //default printing as image
        if (e.pdf) {
          // Export pdf using the print info
          var pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size
          });
          pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
          pdf.save();
        } else  {
        
            e.canvas.toBlob(function(blob) {
              saveAs(blob, 'map.'+e.imageType.replace('image/',''));
            }, e.imageType);
          
        }
      } else {
        console.warn('No canvas to export');
      }
    });
    //to handle printing pdf
    pdfPrint.addEventListener('click',()=>{
        printControl.print({pdf:true, imageType:'image/jpeg'})
    })